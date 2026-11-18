import Link from 'next/link'

import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = { title: 'Đăng ký - dodobanhang' }

export default function RegisterPage() {
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Tạo tài khoản</h1>
      <RegisterForm />
      <p className="mt-4 text-sm">
        Đã có tài khoản? <Link href="/login" className="text-brand-primary">Đăng nhập</Link>
      </p>
    </section>
  )
}
