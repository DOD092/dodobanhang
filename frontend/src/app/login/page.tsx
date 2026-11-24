import Link from 'next/link'

import AuthDivider from '@/components/auth/AuthDivider'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import LoginForm from '@/components/auth/LoginForm'
import { safeRedirect } from '@/utils/safeRedirect'

export const metadata = { title: 'Đăng nhập - dodobanhang' }

// ?email=&verified=1: từ trang xác thực email (VerifyEmailForm); ?email=&reset=1: vừa đặt lại mật khẩu
// ?next=/products/...&reason=cart: bấm "Thêm vào giỏ" khi chưa đăng nhập (BuyBox) -> đăng nhập xong quay lại
const NOTICES = {
  cart: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
  'cart-view': 'Vui lòng đăng nhập để xem giỏ hàng.',
  verified: 'Xác thực email thành công. Đăng nhập để tiếp tục.',
  reset: 'Đặt lại mật khẩu thành công. Đăng nhập bằng mật khẩu mới.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string
    verified?: string
    reset?: string
    next?: string
    reason?: string
  }>
}) {
  const { email, verified, reset, next, reason } = await searchParams
  const notice =
    verified === '1'
      ? NOTICES.verified
      : reset === '1'
        ? NOTICES.reset
        : reason === 'cart'
          ? NOTICES.cart
          : reason === 'cart-view'
            ? NOTICES['cart-view']
            : undefined
  const redirectTo = safeRedirect(next)
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Đăng nhập</h1>
      <LoginForm defaultEmail={email?.slice(0, 255) ?? ''} notice={notice} next={redirectTo} />
      <AuthDivider />
      <GoogleLoginButton mode="signin" next={redirectTo} />
      <p className="mt-4 text-sm">
        Chưa nhận được email xác thực?{' '}
        <Link href="/verify-email" className="text-brand-primary">
          Gửi lại mã
        </Link>
      </p>
      <p className="mt-2 text-sm">
        Chưa có tài khoản? {/* Giữ next để đăng ký bằng Google xong cũng quay lại đúng trang */}
        <Link
          href={
            redirectTo === '/account'
              ? '/register'
              : `/register?next=${encodeURIComponent(redirectTo)}`
          }
          className="text-brand-primary"
        >
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
