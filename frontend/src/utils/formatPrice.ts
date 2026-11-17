const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

export function formatPrice(price: number): string {
  return formatter.format(price)
}
