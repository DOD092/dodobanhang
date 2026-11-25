import { apiRequest, buildApiUrl } from '@/apis/client'

export interface MyCart {
  cartId: string | null
  items: {
    id: string
    variantId: string
    productName: string
    productSlug: string
    variantName: string
    image: string | null // ảnh của biến thể, không có thì ảnh chính của sản phẩm
    unitPrice: number
    quantity: number
  }[]
  totalQuantity: number
  totalAmount: number
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

export function getMyCart(token: string) {
  return apiRequest<MyCart>(buildApiUrl('/cart/me'), { headers: auth(token) })
}

export function addToCart(token: string, variantId: string, quantity: number) {
  return apiRequest<MyCart>(buildApiUrl('/cart/me/items'), {
    method: 'POST',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity }),
  })
}

// Đặt lại số lượng 1 dòng (1-99). itemId = MyCart.items[].id (không phải variantId)
export function updateCartItem(token: string, itemId: string, quantity: number) {
  return apiRequest<MyCart>(buildApiUrl(`/cart/me/items/${encodeURIComponent(itemId)}`), {
    method: 'PATCH',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
}

export function removeCartItem(token: string, itemId: string) {
  return apiRequest<MyCart>(buildApiUrl(`/cart/me/items/${encodeURIComponent(itemId)}`), {
    method: 'DELETE',
    headers: auth(token),
  })
}
