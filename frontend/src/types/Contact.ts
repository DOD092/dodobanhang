export interface Contact {
  name: string
  email: string
  phone: string
  address?: string // form Liên hệ hiện chưa có ô này
  content: string
  // Đã bỏ `domain_id`: backend (POST /api/contacts) không nhận field này và trả 400 nếu gửi lên.
}
