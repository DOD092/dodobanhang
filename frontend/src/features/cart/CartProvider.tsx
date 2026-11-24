'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { useAuth } from '@/features/auth/AuthProvider'

import { getMyCart, type MyCart } from './cartAPI'

/*
  Giỏ hàng của người đang đăng nhập, dùng chung cho cả site (số trên nút giỏ ở header, trang /cart,
  BuyBox). Phải nằm TRONG <AuthProvider> (cần token). Chưa đăng nhập / đăng xuất -> cart = null.
  BuyBox thêm hàng xong gọi setCart(response) để số trên header cập nhật ngay, không gọi API lại.
*/
interface CartContextValue {
  cart: MyCart | null
  count: number // tổng số lượng (hiện trên nút giỏ)
  setCart: (cart: MyCart) => void
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth()
  const [cart, setCart] = useState<MyCart | null>(null)

  const refreshCart = useCallback(async () => {
    // Chỉ khách hàng có giỏ (backend trả 403 cho admin / nhân viên kho)
    if (!token || user?.role !== 'CUSTOMER') {
      setCart(null)
      return
    }
    try {
      setCart(await getMyCart(token))
    } catch {
      setCart(null) // lỗi mạng / token hết hạn: ẩn số, không làm hỏng trang
    }
  }, [token, user?.role])

  // Đăng nhập / đăng xuất / đổi tài khoản -> tải lại giỏ
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cart, count: cart?.totalQuantity ?? 0, setCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng bên trong <CartProvider>')
  return ctx
}
