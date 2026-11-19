'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { CurrentUser, LoginPayload } from '@/types/Auth'

import * as authAPI from './authAPI'

const TOKEN_KEY = 'accessToken'

interface AuthContextValue {
  user: CurrentUser | null
  loading: boolean // đang kiểm tra token lúc mới mở trang
  login: (payload: LoginPayload) => Promise<void>
  // Trả về isNewUser để trang hiện lời chào phù hợp
  loginWithGoogle: (credential: string) => Promise<{ isNewUser: boolean }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  // Mở trang: có token cũ thì hỏi backend xem còn hợp lệ không
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authAPI
      .getMe(token)
      .then(setUser)
      .catch(logout) // token hết hạn / sai -> xoá
      .finally(() => setLoading(false))
  }, [logout])

  // Dùng chung cho mọi cách đăng nhập: lưu token rồi lấy thông tin đầy đủ (role, customerInfo...)
  const applyToken = useCallback(async (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    setUser(await authAPI.getMe(accessToken))
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { accessToken } = await authAPI.login(payload)
      await applyToken(accessToken)
    },
    [applyToken]
  )

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      const { accessToken, isNewUser } = await authAPI.loginWithGoogle(credential)
      await applyToken(accessToken)
      return { isNewUser }
    },
    [applyToken]
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng bên trong <AuthProvider>')
  return ctx
}
