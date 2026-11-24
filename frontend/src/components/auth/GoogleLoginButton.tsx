'use client'

import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import { ApiError } from '@/apis/client'
import { useAuth } from '@/features/auth/AuthProvider'

/*
  Nút "Đăng nhập / Đăng ký với Google" (Google Identity Services, popup).
  Luồng: Google trả `credential` (ID token) -> useAuth().loginWithGoogle() -> POST /api/auth/google
  -> backend verify token, chưa có tài khoản thì tự tạo customer (email Google đã xác minh nên không
  cần nhập mã email) -> lưu accessToken -> /account.

  Cần: NEXT_PUBLIC_GOOGLE_CLIENT_ID (= GOOGLE_CLIENT_ID của backend) và Google Cloud Console >
  OAuth client > "Authorized JavaScript origins" có http://localhost:3001 (thiếu thì popup báo
  lỗi "origin_mismatch" / nút không hiện).
*/

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    context?: 'signin' | 'signup'
    ux_mode?: 'popup'
  }): void
  renderButton(parent: HTMLElement, options: Record<string, string | number>): void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export default function GoogleLoginButton({
  mode = 'signin',
  next = '/account',
}: {
  mode?: 'signin' | 'signup'
  next?: string // đăng nhập xong chuyển tới đây (đã lọc bằng safeRedirect)
}) {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Google chỉ giữ callback truyền lúc initialize -> trỏ qua ref để luôn gọi bản mới nhất
  const onCredential = useRef<(response: GoogleCredentialResponse) => void>(() => {})
  onCredential.current = async ({ credential }) => {
    setError(null)
    setBusy(true)
    try {
      await loginWithGoogle(credential)
      router.push(next)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không kết nối được máy chủ')
      setBusy(false)
    }
  }

  // Vẽ nút khi script đã tải (kể cả khi quay lại trang: script còn trong window, onReady chạy lại)
  useEffect(() => {
    const google = window.google
    const container = containerRef.current
    if (!scriptReady || !google || !container || !CLIENT_ID) return

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => onCredential.current(response),
      context: mode,
      ux_mode: 'popup',
    })
    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: mode === 'signup' ? 'signup_with' : 'signin_with',
      logo_alignment: 'center',
      locale: 'vi',
      width: Math.min(container.offsetWidth, 400), // Google giới hạn 400px
    })
  }, [scriptReady, mode])

  if (!CLIENT_ID) {
    // Thiếu cấu hình thì ẩn nút (không làm hỏng trang); nhắc dev qua console
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID trong frontend/.env.local')
    }
    return null
  }

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      {/* Giữ chỗ cao 44px để trang không nhảy khi nút Google hiện ra */}
      <div
        ref={containerRef}
        aria-busy={busy}
        className={`flex min-h-11 w-full justify-center ${busy ? 'pointer-events-none opacity-60' : ''}`}
      />
      {busy && <p className="mt-2 text-center text-sm text-neutral-600">Đang đăng nhập...</p>}
      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
