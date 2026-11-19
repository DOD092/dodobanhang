'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'

import { ApiError } from '@/apis/client'
import { resendVerificationCode } from '@/features/auth/authAPI'

/*
  Nhập email để nhận lại mã xác thực (POST /api/auth/resend-verification-code). Dùng khi người dùng
  mở /verify-email không kèm email: đã đóng tab sau khi đăng ký, mã hết hạn, hay vào từ link
  "Chưa nhận được email xác thực?" ở trang đăng nhập.
  Gửi được -> /verify-email?email=...&sent=1 để nhập mã (VerifyEmailForm).
*/
const emailSchema = z.email('Email không hợp lệ').max(255)

export default function ResendVerificationForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const verifyHref = (value: string, sent: boolean) =>
    `/verify-email?email=${encodeURIComponent(value)}${sent ? '&sent=1' : ''}`

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = emailSchema.safeParse(email.trim())
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Email không hợp lệ')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await resendVerificationCode(parsed.data)
      router.push(verifyHref(parsed.data, true))
    } catch (err) {
      // 429: vừa gửi chưa tới 60 giây -> mã trước vẫn dùng được, cho sang trang nhập mã luôn
      if (err instanceof ApiError && err.status === 429) {
        router.push(verifyHref(parsed.data, false))
        return
      }
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ')
      setBusy(false)
    }
  }

  const alreadyVerified = error?.includes('đã được xác thực')

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-neutral-600">
        Nhập email đã dùng để đăng ký, chúng tôi sẽ gửi mã xác thực mới (hiệu lực 5 phút).
      </p>
      <div>
        <label htmlFor="resend-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="resend-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`form-input ${error ? 'is-invalid' : ''}`}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
          {alreadyVerified && (
            <>
              {' '}
              <Link href="/login" className="font-semibold underline">
                Đăng nhập
              </Link>
            </>
          )}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-full rounded-lg py-2.5">
        {busy ? 'Đang gửi...' : 'Gửi mã xác thực'}
      </button>
    </form>
  )
}
