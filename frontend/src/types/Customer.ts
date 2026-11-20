// GET/PATCH /api/customers/me/profile (CustomerProfileResponseDto của backend)
export interface CustomerProfile {
  id: string
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string | null // '/uploads/avatars/...' (upload) hoặc URL tuyệt đối (ảnh Google)
  dateOfBirth?: string | null // 'YYYY-MM-DD'
  gender?: string | null // 'male' | 'female' | 'other' (backend nhận chuỗi tự do <= 20)
  customerCode: string
  loyaltyPoints: number
}

// Field đều optional: chỉ gửi field có giá trị (backend UpdateProfileDto)
export interface UpdateProfilePayload {
  fullName?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
}
