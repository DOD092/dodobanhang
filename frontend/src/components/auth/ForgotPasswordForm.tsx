'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ApiError } from '@/apis/client'
import { forgotPassword, resetPassword } from '@/features/auth/authAPI'
import { type ResetPasswordInput, resetPasswordSchema } from '@/features/auth/authSchema'

/*
  Quên mật khẩu, 2 bước trên cùng 1 trang (/forgot-password):
  1. Nhập email -> POST /api/auth/forgot-password. Backend LUÔN trả cùng 1 câu (không lộ email nào
     đã đăng ký), nên luôn sang bước 2.
  2. Nhập mã 6 số trong email (hiệu lực 5 phút) + mật khẩu mới -> POST /api/auth/reset-password
     -> /login?reset=1&email=... (điền sẵn email, hiện thông báo thành công).
  Tài khoản chỉ đăng nhập bằng Google cũng dùng được luồng này để tạo mật khẩu.
*/
const emailSchema = z.email('Email không hợp lệ').max(255)

function errorText(e: unknown) {
  return e instanceof ApiError ? e.message : 'Không kết nối được máy chủ'
}

export default function ForgotPasswordForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail)
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const parsed = emailSchema.safeParse(email.trim())
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Email không hợp lệ')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await forgotPassword(parsed.data)
      setEmail(parsed.data)
      setNotice(`${res.message}. Kiểm tra hộp thư (cả mục Spam) để lấy mã 6 số.`)
      setStep('reset')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  if (step === 'reset') {
    return (
      <ResetStep
        email={email}
        notice={notice}
        onResend={() => sendCode()}
        onChangeEmail={() => {
          setStep('email')
          setNotice(null)
        }}
        resending={busy}
      />
    )
  }

  return (
    <form onSubmit={sendCode} noValidate className="space-y-4">
      <p className="text-sm text-neutral-600">
        Nhập email tài khoản, chúng tôi sẽ gửi mã để đặt lại mật khẩu.
      </p>
      <div>
        <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input ${error ? 'is-invalid' : ''}`}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-full rounded-lg py-2.5">
        {busy ? 'Đang gửi...' : 'Gửi mã đặt lại mật khẩu'}
      </button>
    </form>
  )
}

function ResetStep({
  email,
  notice,
  onResend,
  onChangeEmail,
  resending,
}: {
  email: string
  notice: string | null
  onResend: () => void
  onChangeEmail: () => void
  resending: boolean
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async ({ code, newPassword }: ResetPasswordInput) => {
    setError(null)
    try {
      await resetPassword(email, code, newPassword)
      router.push(`/login?reset=1&email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(errorText(err))
    }
  }

  const fieldError = (name: keyof ResetPasswordInput) =>
    formState.errors[name] && (
      <p className="mt-1 text-sm text-red-600">{formState.errors[name]?.message}</p>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {notice && (
        <p
          role="status"
          className="rounded-lg bg-brand-primary-light px-3 py-2 text-sm text-brand-primary"
        >
          {notice}
        </p>
      )}
      <p className="text-sm text-neutral-600">
        Email: <strong className="text-neutral-900">{email}</strong>{' '}
        <button type="button" onClick={onChangeEmail} className="text-brand-primary">
          (đổi email)
        </button>
      </p>

      <div>
        <label htmlFor="reset-code" className="mb-1 block text-sm font-medium">
          Mã xác nhận (6 số, hiệu lực 5 phút)
        </label>
        <input
          id="reset-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          className="form-input text-center font-mono text-xl tracking-[0.4em]"
          {...register('code', {
            // Bỏ khoảng trắng / ký tự lạ khi dán mã từ email
            setValueAs: (value: string) => value.replace(/\D/g, '').slice(0, 6),
          })}
        />
        {fieldError('code')}
      </div>
      <div>
        <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
          Mật khẩu mới
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className="form-input"
          {...register('newPassword')}
        />
        {fieldError('newPassword')}
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
          Nhập lại mật khẩu mới
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          className="form-input"
          {...register('confirmPassword')}
        />
        {fieldError('confirmPassword')}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="btn btn-primary w-full rounded-lg py-2.5"
      >
        {formState.isSubmitting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
      </button>
      <p className="text-center text-sm text-neutral-600">
        Không nhận được mã?{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="font-semibold text-brand-primary disabled:text-neutral-400"
        >
          {resending ? 'Đang gửi...' : 'Gửi lại mã'}
        </button>
      </p>
    </form>
  )
}
