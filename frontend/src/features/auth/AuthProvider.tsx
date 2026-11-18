'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { CurrentUser, LoginPayload } from '@/types/Auth'

import * as authAPI from './authAPI'

const TOKEN_KEY = 'accessToken'

interface AuthContextValue {
  user: CurrentUser | null
  loading: boolean // đang kiểm tra token lúc mới mở trang
  login: (payload: LoginPayload) => Promise<void>
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

  const login = useCallback(async (payload: LoginPayload) => {
    const { accessToken } = await authAPI.login(payload)
    localStorage.setItem(TOKEN_KEY, accessToken)
    setUser(await authAPI.getMe(accessToken))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng bên trong <AuthProvider>')
  return ctx
}
