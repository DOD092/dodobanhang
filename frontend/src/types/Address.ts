// Khớp entity Address của backend (GET /api/addresses/me)
export interface Address {
  id: string
  receiverName: string
  receiverPhone: string
  addressLine: string
  ward: string
  district: string
  province: string
  isDefault: boolean
}

export interface CreateAddressPayload {
  receiverName: string
  receiverPhone: string
  addressLine: string
  ward: string
  district: string
  province: string
  isDefault?: boolean
}
