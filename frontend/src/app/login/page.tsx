import Link from 'next/link'

import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Đăng nhập - dodobanhang' }

export default function LoginPage() {
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Đăng nhập</h1>
      <LoginForm />
      <p className="mt-4 text-sm">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-brand-primary">
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
