import ResendVerificationForm from '@/components/auth/ResendVerificationForm'
import VerifyEmailForm from '@/components/auth/VerifyEmailForm'

export const metadata = { title: 'Xác thực email - dodobanhang' }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; from?: string; sent?: string }>
}) {
  const { email, from, sent } = await searchParams
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Xác thực email</h1>
      {/* Không có email trên URL (đóng tab sau khi đăng ký, vào từ link ở /login) -> nhập email để nhận mã mới */}
      {email ? (
        <VerifyEmailForm email={email} fromLogin={from === 'login'} justSent={sent === '1'} />
      ) : (
        <ResendVerificationForm />
      )}
    </section>
  )
}
