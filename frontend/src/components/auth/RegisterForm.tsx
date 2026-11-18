'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { register as registerApi } from '@/features/auth/authAPI'
import { type RegisterInput, registerSchema } from '@/features/auth/authSchema'

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async ({ confirmPassword: _, phone, ...rest }: RegisterInput) => {
    setError(null)
    try {
      // Không gửi confirmPassword (backend báo 400 field lạ); phone rỗng thì bỏ
      await registerApi({ ...rest, ...(phone ? { phone } : {}) })
      router.push(`/verify-email?email=${encodeURIComponent(rest.email)}`)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
    }
  }

  const field = (name: keyof RegisterInput, label: string, type = 'text') => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={name} type={type} className="form-input" {...register(name)} />
      {formState.errors[name] && (
        <p className="mt-1 text-sm text-red-600">{formState.errors[name]?.message}</p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {field('name', 'Họ tên')}
      {field('email', 'Email', 'email')}
      {field('phone', 'Số điện thoại (không bắt buộc)', 'tel')}
      {field('password', 'Mật khẩu', 'password')}
      {field('confirmPassword', 'Nhập lại mật khẩu', 'password')}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary w-full rounded-lg py-2.5">
        {formState.isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  )
}
