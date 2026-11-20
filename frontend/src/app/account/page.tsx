'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import ChangePasswordForm from '@/components/auth/ChangePasswordForm'
import { useAuth } from '@/features/auth/AuthProvider'

// Trang tài khoản (Client Component vì token nằm ở localStorage). Chưa đăng nhập -> /login.
// Đây chỉ là chặn ở giao diện; dữ liệu được bảo vệ thật ở backend bằng JWT.
export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !user) return <p className="container py-12">Đang tải...</p>

  const rows: [string, string][] = [
    ['Email', user.email],
    ['Điện thoại', user.phone ?? '—'],
    ['Mã khách hàng', user.customerInfo?.customerCode ?? '—'],
    ['Điểm thưởng', String(user.customerInfo?.loyaltyPoints ?? 0)],
  ]

  return (
    <div className="container max-w-2xl space-y-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="mb-0 text-2xl font-bold">Xin chào, {user.fullName}</h1>
        <button
          onClick={() => {
            logout()
            router.push('/')
          }}
          className="btn btn-outline-primary rounded-lg px-4 py-2"
        >
          Đăng xuất
        </button>
      </div>

      <section className="rounded-2xl border-2 border-neutral-200 p-6">
        <h2 className="mb-4 text-lg font-bold">Thông tin tài khoản</h2>
        <dl className="m-0 grid grid-cols-[9rem_1fr] gap-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-neutral-500">{label}</dt>
              <dd className="m-0 break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border-2 border-neutral-200 p-6">
        <h2 className="mb-4 text-lg font-bold">Đổi mật khẩu</h2>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
