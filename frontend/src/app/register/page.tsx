import Link from 'next/link'

import AuthDivider from '@/components/auth/AuthDivider'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = { title: 'Đăng ký - dodobanhang' }

export default function RegisterPage() {
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Tạo tài khoản</h1>
      <RegisterForm />
      <AuthDivider />
      {/* Đăng ký bằng Google: tạo tài khoản ngay, không cần mã xác thực email */}
      <GoogleLoginButton mode="signup" />
      <p className="mt-4 text-sm">
        Đã có tài khoản? <Link href="/login" className="text-brand-primary">Đăng nhập</Link>
      </p>
    </section>
  )
}
