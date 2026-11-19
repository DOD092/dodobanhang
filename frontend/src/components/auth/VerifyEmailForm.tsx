'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ApiError } from '@/apis/client'
import { resendVerificationCode, verifyEmail } from '@/features/auth/authAPI'

/*
  Nhập mã 6 số backend gửi qua email sau khi đăng ký (POST /api/auth/verify-email).
  - Mã sống CODE_TTL giây (backend: 5 phút) -> đếm ngược; hết hạn thì nhắc bấm "Gửi lại mã".
  - "Gửi lại mã" (POST /api/auth/resend-verification-code) khoá RESEND_COOLDOWN giây sau mỗi lần gửi.
  - Xác thực xong -> /login?verified=1&email=... (điền sẵn email, hiện thông báo thành công).
  `fromLogin`: vào đây từ trang đăng nhập (tài khoản chưa xác thực) -> mã cũ có thể đã hết hạn.
*/
const CODE_TTL = 5 * 60
const RESEND_COOLDOWN = 60

type Message = { ok: boolean; text: string }

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VerifyEmailForm({
  email,
  fromLogin = false,
}: {
  email: string
  fromLogin?: boolean
}) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<Message | null>(
    fromLogin
      ? {
          ok: false,
          text: 'Tài khoản chưa xác thực email. Nhập mã trong email, hoặc bấm "Gửi lại mã" nếu mã đã hết hạn.',
        }
      : null
  )
  const [busy, setBusy] = useState(false)
  const [verified, setVerified] = useState(false)
  const [alreadyVerified, setAlreadyVerified] = useState(false)
  // Vào từ trang đăng nhập thì không biết mã còn hạn bao lâu -> không đếm ngược, cho gửi lại ngay
  const [expiresIn, setExpiresIn] = useState(fromLogin ? 0 : CODE_TTL)
  const [cooldown, setCooldown] = useState(fromLogin ? 0 : RESEND_COOLDOWN)

  // 1 timer cho cả 2 bộ đếm
  useEffect(() => {
    if (expiresIn <= 0 && cooldown <= 0) return
    const id = setInterval(() => {
      setExpiresIn((s) => Math.max(0, s - 1))
      setCooldown((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [expiresIn, cooldown])

  const loginHref = `/login?verified=1&email=${encodeURIComponent(email)}`

  const handleError = (e: unknown) => {
    const text = e instanceof ApiError ? e.message : 'Không kết nối được máy chủ'
    // Đã xác thực từ trước (vd mở lại link cũ) -> chỉ cần đăng nhập
    if (e instanceof ApiError && text.includes('đã được xác thực')) setAlreadyVerified(true)
    setMsg({ ok: false, text })
  }

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6 || busy) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await verifyEmail(email, code)
      setVerified(true)
      setMsg({ ok: true, text: `${res.message} Đang chuyển sang trang đăng nhập...` })
      setTimeout(() => router.push(loginHref), 1200)
    } catch (err) {
      handleError(err)
      setBusy(false)
    }
  }

  const onResend = async () => {
    if (cooldown > 0 || busy) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await resendVerificationCode(email)
      setMsg({ ok: true, text: res.message })
      setCode('')
      setExpiresIn(CODE_TTL)
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      handleError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onVerify} noValidate className="space-y-4">
      <p className="text-sm text-neutral-600">
        Mã 6 số đã gửi tới <strong className="text-neutral-900">{email}</strong>. Kiểm tra cả thư
        mục Spam nếu không thấy.
      </p>

      <div>
        <label htmlFor="verification-code" className="mb-1 block text-sm font-medium">
          Mã xác thực
        </label>
        <input
          id="verification-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          placeholder="______"
          disabled={verified}
          className="form-input text-center font-mono text-2xl tracking-[0.5em]"
        />
        <p className="mt-1 text-sm text-neutral-500" aria-live="polite">
          {verified
            ? ' '
            : expiresIn > 0
              ? `Mã hết hạn sau ${formatTime(expiresIn)}`
              : 'Mã hết hạn sau 5 phút. Hết hạn thì bấm "Gửi lại mã" để nhận mã mới.'}
        </p>
      </div>

      {msg && (
        <p
          role={msg.ok ? 'status' : 'alert'}
          className={`rounded-lg px-3 py-2 text-sm ${
            msg.ok ? 'bg-brand-primary-light text-brand-primary' : 'bg-red-50 text-red-800'
          }`}
        >
          {msg.text}
          {alreadyVerified && (
            <>
              {' '}
              <Link href={loginHref} className="font-semibold underline">
                Đăng nhập ngay
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || verified || code.length !== 6}
        className="btn btn-primary w-full rounded-lg py-2.5"
      >
        {busy && !verified ? 'Đang xử lý...' : verified ? 'Đã xác thực' : 'Xác thực'}
      </button>

      <p className="text-center text-sm text-neutral-600">
        Không nhận được mã?{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={busy || verified || cooldown > 0}
          className="font-semibold text-brand-primary disabled:cursor-not-allowed disabled:text-neutral-400"
        >
          {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : 'Gửi lại mã'}
        </button>
      </p>
    </form>
  )
}
