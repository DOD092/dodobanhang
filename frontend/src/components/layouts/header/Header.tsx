'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { MenuIcon, XIcon } from '@/components/common/Icons'
import { useAuth } from '@/features/auth/AuthProvider'

import CartMenu from './CartMenu'
import Logo from './Logo'
import NavLinks from './NavLinks'

/*
  Header 1 hàng, dính trên cùng khi cuộn.
  Thứ tự DOM: Logo | cụm nút | menu. Không dùng thư viện nào cho việc thu gọn, chỉ `useState` +
  Tailwind (thay cho Bootstrap collapse trước đây):
  - Mobile (< lg): cụm nút cùng hàng Logo (đẩy sang phải bằng `ms-auto`); menu `w-full` nên tự
    xuống hàng dưới, trượt xuống mượt theo `menuOpen` (xem chú thích tại chỗ khai báo `#main-nav`).
  - Desktop (>= lg): cụm nút thêm `lg:order-3` để ra sau menu -> Logo | Menu | cụm nút; menu luôn
    giãn hết, không quan tâm `menuOpen`.
*/
export default function Header() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // Đổi trang thì đóng menu mobile
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav aria-label="Menu chính" className="py-2">
        <div className="container flex flex-wrap items-center gap-x-4 gap-y-2 lg:flex-nowrap">
          <Logo />

          <div className="ms-auto flex items-center gap-1 sm:gap-2 lg:order-3">
            {/* Chưa đăng nhập -> /login, đã đăng nhập -> /account. Chờ AuthProvider kiểm tra token
                xong mới hiện để link không đổi đích giữa chừng. */}
            {/* Giỏ hàng: luôn hiện; chưa đăng nhập thì trang /cart tự yêu cầu đăng nhập.
                Rê chuột vào thì hiện khung xem nhanh sản phẩm trong giỏ (CartMenu). */}
            <CartMenu />
            {!loading && (
              <Link
                href={user ? '/account' : '/login'}
                className="btn rounded-full bg-brand-accent px-4 py-2 text-sm whitespace-nowrap text-brand-primary hover:bg-brand-accent-dark"
              >
                Tài khoản
              </Link>
            )}
            <button
              type="button"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg border border-neutral-300 p-1.5 text-neutral-900 sm:ms-1 sm:p-2 lg:hidden"
            >
              {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>

          {/* Menu mobile trượt xuống mượt: cùng kỹ thuật với chi tiết dịch vụ (ServicePanel) -
              grid-rows 0fr -> 1fr, vì height: auto không animate được. `overflow-hidden` phải đặt
              ở CON (grid item), không phải khung ngoài (grid container): grid item mặc định có
              min-height: auto nên không co về 0fr được nếu chính nó không có overflow khác
              `visible` - thiếu bước này thì khung vẫn cao đủ nội dung, chỉ bị `opacity-0` làm trong
              suốt (từng bị vậy, để lại khoảng trắng chèn giữa header và nội dung bên dưới).
              Desktop (>= lg): luôn giãn hết `lg:grid-rows-[1fr]`, bỏ qua `menuOpen`; div con chuyển
              thành hàng ngang canh giữa (`lg:flex lg:justify-center`). */}
          <div
            id="main-nav"
            className={`grid w-full transition-all duration-300 ease-out lg:order-2 lg:w-auto lg:flex-1 lg:grid-rows-[1fr] lg:opacity-100 ${
              menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden lg:flex lg:justify-center">
              <NavLinks />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
