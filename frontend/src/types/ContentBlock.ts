// Nội dung dài (chữ + ảnh) của trang chi tiết, lưu dạng mảng các khối (JSON).
// Chỉ lưu ý nghĩa của khối (tiêu đề, đoạn, danh sách, ảnh), KHÔNG lưu style (màu, class CSS...):
// cách hiển thị do component quyết định nên đổi giao diện không phải sửa dữ liệu.
// Thêm loại khối mới thì thêm vào union `ContentBlock` và xử lý trong component hiển thị.

export interface HeadingBlock {
  type: 'heading'
  level: 2 | 3 // h1 là tiêu đề của trang (cột name), không nằm trong khối
  text: string
}

export interface ParagraphBlock {
  type: 'paragraph'
  text: string
}

export interface ListBlock {
  type: 'list'
  style: 'unordered' | 'ordered'
  items: string[]
}

export interface ImageBlock {
  type: 'image'
  src: string
  alt: string
  width: number // kích thước gốc của ảnh, để next/image giữ chỗ và trang không bị giật
  height: number
  caption?: string // vd: "Kho hàng - Nguồn: dodobanhang"
}

export type ContentBlock = HeadingBlock | ParagraphBlock | ListBlock | ImageBlock
