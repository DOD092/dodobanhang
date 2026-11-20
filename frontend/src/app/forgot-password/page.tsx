import Link from 'next/link'

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata = { title: 'Quên mật khẩu - dodobanhang' }

// ?email=: link "Quên mật khẩu?" ở trang đăng nhập mang theo email đã gõ
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Quên mật khẩu</h1>
      <ForgotPasswordForm defaultEmail={email?.slice(0, 255) ?? ''} />
      <p className="mt-6 text-sm">
        Nhớ ra mật khẩu?{' '}
        <Link href="/login" className="text-brand-primary">
          Đăng nhập
        </Link>
      </p>
    </section>
  )
}
