'use client'

import { useState } from 'react'

import { coreValueIcons } from '@/components/home/coreValueIcons'
import { coreValues } from '@/config/home'

/*
  Giá trị cốt lõi ở /about: 1 hàng panel ngang, cùng kiểu ServicePanel ở /services.
  - >= lg: mặc định KHÔNG panel nào mở, 5 panel bằng nhau (icon + tên, cùng viền trên đỏ). Rê chuột
    / Tab / bấm vào panel nào thì panel đó mở: giãn flex-1 -> flex-3, nền đen, mô tả trượt ra
    (grid-rows 0fr -> 1fr vì height: auto không animate được); các panel còn lại bỏ viền đỏ để làm
    nổi panel đang mở. Chuột rời khỏi cả hàng, hoặc focus Tab ra ngoài hàng, thì đóng hết.
    Rê từ panel này sang panel kia không đóng giữa chừng vì mouseleave đặt ở <ol>, không ở <li>.
    Màn hình cảm ứng (tablet >= lg): chạm để mở, panel giữ mở tới khi chạm panel khác (không có
    mouseleave). Dùng useState thay vì CSS :hover để gom 3 cách mở (chuột, Tab, chạm) về 1 chỗ.
  - < lg: xếp dọc, panel nào cũng hiện đủ mô tả (không có hover), bỏ qua state.
  - Mô tả luôn có trong DOM (chỉ ẩn bằng chiều cao 0 + opacity) nên trình đọc màn hình đọc đủ.
  Thêm/bớt giá trị trong config/home.ts thì số panel tự đổi; quá ~6 panel thì panel đóng sẽ hẹp
  quá, khi đó nên chia hàng như splitIntoRows() ở app/services/page.tsx.
*/
export default function CoreValuePanels() {
  // null = không panel nào mở
  const [active, setActive] = useState<number | null>(null)

  return (
    <ol
      onMouseLeave={() => setActive(null)}
      onBlur={(event) => {
        // Chỉ đóng khi focus rời hẳn khỏi hàng (Tab sang panel kế bên vẫn nằm trong <ol>)
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null)
      }}
      className="m-0 flex list-none flex-col gap-4 p-0 lg:h-80 lg:flex-row"
    >
      {coreValues.map((item, index) => {
        const Icon = coreValueIcons[item.icon]
        const open = index === active
        return (
          <li
            key={item.title}
            tabIndex={0}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            className={`relative flex min-w-0 flex-col overflow-hidden rounded-3xl border-2 border-t-4 border-b-4 border-neutral-300 border-t-brand-primary bg-white p-6 shadow-md outline-none transition-all duration-500 ease-out focus-visible:ring-4 focus-visible:ring-brand-primary/30 sm:p-8 lg:cursor-pointer lg:p-6 xl:p-7 ${
              open
                ? 'lg:flex-3 lg:border-brand-primary lg:border-t-brand-accent lg:bg-brand-primary lg:text-white lg:shadow-xl'
                : `lg:flex-1 ${active === null ? '' : 'lg:border-t-transparent'}`
            }`}
          >
            <span
              className={`relative mb-5 flex size-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                open
                  ? 'bg-brand-primary text-white lg:bg-brand-accent lg:text-brand-primary'
                  : 'bg-brand-primary text-white'
              }`}
            >
              <Icon className="size-7" />
            </span>

            <h3 className="relative mb-0 text-lg font-bold whitespace-nowrap xl:text-xl">
              {item.title}
            </h3>

            {/* Mô tả: >= lg chỉ hiện ở panel đang mở. min-w: chữ không nhảy dòng liên tục trong lúc
                panel đang giãn (giống danh sách chi tiết của ServicePanel). Giá trị min-w phải <=
                bề rộng chữ của panel mở, nếu không bị cắt chữ: flex chỉ chia phần còn lại SAU KHI
                trừ padding + viền của cả 5 panel, nên panel mở (3/7) còn ~284px ở 1024px và ~376px
                ở >= 1280px (container 1232px). Đổi padding, gap, số panel hay tỉ lệ flex-3 thì
                tính lại 2 số này. */}
            <div
              className={`grid transition-all duration-500 ease-out ${
                open
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[1fr] lg:grid-rows-[0fr] lg:opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`mt-3 mb-0 text-neutral-600 lg:min-w-70 xl:min-w-92 xl:leading-7 ${
                    open ? 'lg:text-neutral-300' : ''
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
