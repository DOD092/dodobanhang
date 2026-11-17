import { apiPost } from '@/apis/client'
import type { Contact } from '@/types/Contact'

// Gọi từ trình duyệt (ContactForm là Client Component). Backend gửi email tới hộp thư công ty
// (CONTACT_EMAIL), không lưu DB. Lỗi (400 sai dữ liệu, 429 gửi quá nhiều, 5xx) ném ApiError.
export async function createContact(payload: Contact): Promise<void> {
  await apiPost('/contacts', payload)
}
