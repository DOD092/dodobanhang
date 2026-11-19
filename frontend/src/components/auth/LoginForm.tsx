'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'
import { type LoginInput, loginSchema } from '@/features/auth/authSchema'

interface LoginFormProps {
  defaultEmail?: string // điền sẵn (vd vừa xác thực email xong)
  verified?: boolean // vừa xác thực email thành công -> hiện thông báo
}

export default function LoginForm({ defaultEmail = '', verified = false }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState, getValues } = useForm<LoginInput>({
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
      {verified && (
        <p
          role="status"
          className="rounded-lg bg-brand-primary-light px-3 py-2 text-sm text-brand-primary"
        >
          Xác thực email thành công. Đăng nhập để tiếp tục.
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
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Mật khẩu
        </label>
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
