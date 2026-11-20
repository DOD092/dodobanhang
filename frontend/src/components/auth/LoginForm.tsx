'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { type LoginInput, loginSchema } from '@/features/auth/authSchema'

interface LoginFormProps {
  defaultEmail?: string // điền sẵn (vd vừa xác thực email xong)
  notice?: string // thông báo thành công từ bước trước (xác thực email, đặt lại mật khẩu)
}

export default function LoginForm({ defaultEmail = '', notice }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState, getValues, watch } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: '' },
  })

  const onSubmit = async (values: LoginInput) => {
    setError(null)
    try {
      await login(values)
      router.push('/account')
    } catch (e) {
      // 403 "chưa xác thực" -> chuyển sang trang nhập mã (from=login: mã cũ có thể đã hết hạn)
      if (e instanceof ApiError && e.status === 403 && e.message.includes('xác thực')) {
        router.push(`/verify-email?email=${encodeURIComponent(getValues('email'))}&from=login`)
        return
      }
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
    }
  }

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
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input id="email" type="email" className="form-input" {...register('email')} />
        <p className="mt-1 text-sm text-red-600">{formState.errors.email?.message}</p>
      </div>
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            Mật khẩu
          </label>
          {/* Mang theo email đã gõ (nếu có) để khỏi nhập lại */}
          <Link
            href={`/forgot-password${watch('email') ? `?email=${encodeURIComponent(watch('email'))}` : ''}`}
            className="text-sm text-brand-primary"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus={Boolean(defaultEmail)}
          className="form-input"
          {...register('password')}
        />
        <p className="mt-1 text-sm text-red-600">{formState.errors.password?.message}</p>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="btn btn-primary w-full rounded-lg py-2.5"
      >
        {formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
