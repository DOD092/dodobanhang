import Link from 'next/link'

import AuthDivider from '@/components/auth/AuthDivider'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Đăng nhập - dodobanhang' }

// ?email=&verified=1: từ trang xác thực email chuyển sang (VerifyEmailForm)
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; verified?: string }>
}) {
  const { email, verified } = await searchParams
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Đăng nhập</h1>
      <LoginForm defaultEmail={email?.slice(0, 255) ?? ''} verified={verified === '1'} />
      <AuthDivider />
      <GoogleLoginButton mode="signin" />
      <p className="mt-4 text-sm">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-brand-primary">
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
