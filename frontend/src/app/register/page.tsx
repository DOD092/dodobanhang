import Link from 'next/link'

import AuthDivider from '@/components/auth/AuthDivider'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import RegisterForm from '@/components/auth/RegisterForm'
import { safeRedirect } from '@/utils/safeRedirect'

export const metadata = { title: 'Đăng ký - dodobanhang' }

// ?next=: từ trang đăng nhập khi khách đang mua dở (BuyBox) -> đăng ký bằng Google xong quay lại.
// Đăng ký bằng email thì phải xác thực mã trước nên vẫn đi luồng /verify-email -> /login.
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const redirectTo = safeRedirect(next)
  const loginHref =
    redirectTo === '/account' ? '/login' : `/login?next=${encodeURIComponent(redirectTo)}`

  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Tạo tài khoản</h1>
      <RegisterForm />
      <AuthDivider />
      {/* Đăng ký bằng Google: tạo tài khoản ngay, không cần mã xác thực email */}
      <GoogleLoginButton mode="signup" next={redirectTo} />
      <p className="mt-4 text-sm">
        Đã có tài khoản?{' '}
        <Link href={loginHref} className="text-brand-primary">
          Đăng nhập
        </Link>
      </p>
    </section>
  )
}
