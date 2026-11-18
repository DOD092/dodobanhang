'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ApiError } from '@/apis/client'
import { resendVerificationCode, verifyEmail } from '@/features/auth/authAPI'

export default function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async (fn: () => Promise<{ message: string }>, onOk?: () => void) => {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fn()
      setMsg({ ok: true, text: res.message })
      onOk?.()
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? e.message : 'Không kết nối được máy chủ' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        run(() => verifyEmail(email, code), () => setTimeout(() => router.push('/login'), 1000))
      }}
      className="space-y-4"
    >
      <p className="text-sm text-neutral-600">Mã 6 số đã gửi tới <strong>{email}</strong> (hiệu lực 5 phút).</p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric"
        placeholder="123456"
        className="form-input text-center text-2xl tracking-[0.5em]"
      />
      {msg && <p className={`text-sm ${msg.ok ? 'text-brand-primary' : 'text-red-600'}`}>{msg.text}</p>}
      <button type="submit" disabled={busy || code.length !== 6} className="btn btn-primary w-full rounded-lg py-2.5">
        Xác thực
      </button>
      <button type="button" disabled={busy} onClick={() => run(() => resendVerificationCode(email))} className="text-sm text-brand-primary">
        Gửi lại mã
      </button>
    </form>
  )
}
