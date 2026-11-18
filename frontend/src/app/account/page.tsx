'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/features/auth/AuthProvider'

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !user) return <p className="container py-12">Đang tải...</p>

  return (
    <section className="container max-w-xl py-12">
      <h1 className="mb-6 text-2xl font-bold">Xin chào, {user.fullName}</h1>
      <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="text-neutral-500">Email</dt><dd>{user.email}</dd>
        <dt className="text-neutral-500">Điện thoại</dt><dd>{user.phone ?? '—'}</dd>
        <dt className="text-neutral-500">Vai trò</dt><dd>{user.role}</dd>
        <dt className="text-neutral-500">Mã KH</dt><dd>{user.customerInfo?.customerCode ?? '—'}</dd>
      </dl>
      <button onClick={() => { logout(); router.push('/') }} className="btn btn-outline-primary mt-8 rounded-lg px-4 py-2">
        Đăng xuất
      </button>
    </section>
  )
}
