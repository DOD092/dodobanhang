export interface RegisterPayload {
  email: string
  password: string
  name: string
  phone?: string
}

export interface LoginPayload {
  email: string
  password: string
}

// POST /auth/google: đăng nhập hoặc tự tạo tài khoản customer bằng Google
export interface GoogleAuthResult {
  accessToken: string
  isNewUser: boolean // true = lần này vừa tạo tài khoản mới
  user: { id: string; email: string; fullName: string }
}

export interface CurrentUser {
  id: string
  email: string
  fullName: string
  phone?: string
  role: 'CUSTOMER' | 'WAREHOUSE_OPERATOR' | 'ADMIN'
  status: string
  customerInfo?: {
    customerCode: string
    loyaltyPoints: number
  }
}
