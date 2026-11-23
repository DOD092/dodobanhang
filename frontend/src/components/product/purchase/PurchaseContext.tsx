'use client'

import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

import type { ProductVariant } from '@/types/Product'

/*
  State mua hàng dùng chung giữa cột giữa (chọn biến thể, giá) và khung mua bên phải (số lượng,
  tạm tính) ở trang chi tiết. 2 khối nằm ở 2 cột grid khác nhau nên dùng context thay vì gộp 1 component.
*/
interface PurchaseState {
  variants: ProductVariant[]
  selected: ProductVariant | null
  select: (id: string) => void
  quantity: number
  setQuantity: (value: number) => void
}

const PurchaseContext = createContext<PurchaseState | null>(null)

export const MAX_QUANTITY = 99

export function PurchaseProvider({
  variants,
  children,
}: {
  variants: ProductVariant[]
  children: ReactNode
}) {
  // Mặc định chọn biến thể rẻ nhất có giá (khớp giá hiện trên thẻ ở trang danh sách)
  const initial = useMemo(() => {
    const priced = variants.filter((v) => v.price !== null)
    return (priced.sort((a, b) => (a.price as number) - (b.price as number))[0] ?? variants[0])?.id
  }, [variants])
  const [selectedId, setSelectedId] = useState(initial)
  const [quantity, setQuantityState] = useState(1)

  const value: PurchaseState = {
    variants,
    selected: variants.find((v) => v.id === selectedId) ?? null,
    select: setSelectedId,
    quantity,
    setQuantity: (next) =>
      setQuantityState(Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(next) || 1))),
  }
  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext)
  if (!ctx) throw new Error('usePurchase phải dùng bên trong <PurchaseProvider>')
  return ctx
}
