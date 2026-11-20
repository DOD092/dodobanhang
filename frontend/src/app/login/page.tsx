import Link from 'next/link'

import AuthDivider from '@/components/auth/AuthDivider'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Đăng nhập - dodobanhang' }

// ?email=&verified=1: từ trang xác thực email (VerifyEmailForm); ?email=&reset=1: vừa đặt lại mật khẩu
const NOTICES = {
  verified: 'Xác thực email thành công. Đăng nhập để tiếp tục.',
  reset: 'Đặt lại mật khẩu thành công. Đăng nhập bằng mật khẩu mới.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; verified?: string; reset?: string }>
}) {
  const { email, verified, reset } = await searchParams
  const notice = verified === '1' ? NOTICES.verified : reset === '1' ? NOTICES.reset : undefined
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Đăng nhập</h1>
      <LoginForm defaultEmail={email?.slice(0, 255) ?? ''} notice={notice} />
      <AuthDivider />
      <GoogleLoginButton mode="signin" />
      <p className="mt-4 text-sm">
        Chưa nhận được email xác thực?{' '}
        <Link href="/verify-email" className="text-brand-primary">
          Gửi lại mã
        </Link>
      </p>
      <p className="mt-2 text-sm">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-brand-primary">
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
