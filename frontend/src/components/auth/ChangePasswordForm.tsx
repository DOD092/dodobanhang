'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/apis/client'
import { changePassword } from '@/features/auth/authAPI'
import { useAuth } from '@/features/auth/AuthProvider'
import { type ChangePasswordInput, changePasswordSchema } from '@/features/auth/authSchema'

/*
  Đổi mật khẩu khi đã đăng nhập (POST /api/auth/change-password, header Bearer token).
  - 401: token hết hạn -> đăng xuất, về /login.
  - 400 "đăng nhập bằng Google chưa có mật khẩu": hiện link /forgot-password để tự tạo mật khẩu.
  Lưu ý: JWT cũ vẫn dùng được tới khi hết hạn (backend chưa thu hồi token sau khi đổi mật khẩu).
*/
export default function ChangePasswordForm() {
  const router = useRouter()
  const { token, user, logout } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { register, handleSubmit, formState, reset } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordInput) => {
    if (!token) return
    setError(null)
    setSuccess(null)
    try {
      const res = await changePassword(token, { currentPassword, newPassword })
      setSuccess(res.message)
      reset()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout()
        router.replace('/login')
        return
      }
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
    }
  }

  const noPassword = error?.includes('chưa có mật khẩu')
  const fields: { name: keyof ChangePasswordInput; label: string; autoComplete: string }[] = [
    { name: 'currentPassword', label: 'Mật khẩu hiện tại', autoComplete: 'current-password' },
    { name: 'newPassword', label: 'Mật khẩu mới', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Nhập lại mật khẩu mới', autoComplete: 'new-password' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {fields.map(({ name, label, autoComplete }) => (
        <div key={name}>
          <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {label}
          </label>
          <input
            id={name}
            type="password"
            autoComplete={autoComplete}
            className="form-input"
            {...register(name)}
          />
          {formState.errors[name] && (
            <p className="mt-1 text-sm text-red-600">{formState.errors[name]?.message}</p>
          )}
        </div>
      ))}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-brand-primary-light px-3 py-2 text-sm text-brand-primary"
        >
          {success}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
          {noPassword && user && (
            <>
              {' '}
              <Link
                href={`/forgot-password?email=${encodeURIComponent(user.email)}`}
                className="font-semibold underline"
              >
                Tạo mật khẩu
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="btn btn-primary rounded-lg px-5 py-2.5"
      >
        {formState.isSubmitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
      </button>
    </form>
  )
}
