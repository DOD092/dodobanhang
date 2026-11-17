'use client'

import { useEffect, useState } from 'react'

import { ArrowUpIcon } from './Icons'

const SHOW_AFTER_PX = 400 // cuộn qua khoảng 1 màn hình mới hiện, tránh hiện ngay khi vừa vào trang

// Nút nổi góc dưới phải, hiện khi cuộn xuống, bấm để cuộn mượt về đầu trang. Đặt ở root layout
// nên có ở mọi trang, không phải thêm riêng từng trang dài (dịch vụ, sản phẩm...).
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Về đầu trang"
      // z-30: thấp hơn lớp phủ/khung của FiltersDrawer (z-40/z-50) để không nổi lên trên khi mở
      className={`fixed right-4 bottom-4 z-30 flex size-11 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-all duration-300 hover:bg-brand-primary-dark sm:right-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUpIcon className="size-5" />
    </button>
  )
}
