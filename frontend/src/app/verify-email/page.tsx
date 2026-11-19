import { redirect } from 'next/navigation'

import VerifyEmailForm from '@/components/auth/VerifyEmailForm'

export const metadata = { title: 'Xác thực email - dodobanhang' }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; from?: string }>
}) {
  const { email, from } = await searchParams
  if (!email) redirect('/register')
  return (
    <section className="container max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Xác thực email</h1>
      <VerifyEmailForm email={email} fromLogin={from === 'login'} />
    </section>
  )
}
