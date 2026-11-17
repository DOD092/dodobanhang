'use client'

import { useId, useState, type KeyboardEvent } from 'react'

import { EyeIcon, TargetIcon } from '@/components/common/Icons'
import { siteConfig } from '@/config/site'

const items = [
  {
    title: 'Tầm nhìn',
    icon: EyeIcon,
    text: `${siteConfig.shortName} hướng đến việc trở thành một đơn vị cung cấp vật dụng, thiết bị và máy móc công nghiệp đáng tin cậy, nơi khách hàng có thể tìm thấy những sản phẩm phù hợp với nhu cầu sử dụng và công việc của mình. Chúng tôi mong muốn phát triển từng bước, mở rộng thị trường nhưng vẫn giữ được điều quan trọng nhất trong cách làm của mình: lấy sự hài lòng và lợi ích của khách hàng làm nền tảng cho sự phát triển.`,
  },
  {
    title: 'Sứ mệnh',
    icon: TargetIcon,
    text: `Mang đến cho khách hàng những sản phẩm phù hợp, chất lượng và có giá trị sử dụng thực tế, cùng với sự tư vấn tận tâm trong quá trình lựa chọn và sử dụng. ${siteConfig.shortName} không chỉ hướng đến việc cung cấp một sản phẩm, mà mong muốn trở thành người đồng hành đáng tin cậy, thấu hiểu nhu cầu của khách hàng và cùng khách hàng tìm ra lựa chọn phù hợp nhất cho công việc của mình.`,
  },
]

/*
  Tầm nhìn / Sứ mệnh ở /about, cột phải cạnh chữ "Về chúng tôi".
  - >= lg: 1 khung có 2 tab, bấm (hoặc phím mũi tên trái/phải) để đổi nội dung. Các panel chồng
    lên cùng 1 ô grid (col/row-start-1), panel không chọn chỉ ẩn bằng invisible + opacity, nên
    khung luôn cao bằng panel dài nhất: đổi tab không làm khung co giãn, chữ bên dưới không nhảy.
  - < lg: ẩn thanh tab, hiện đủ cả 2 panel nối tiếp trong cùng khung (ngăn bằng đường kẻ).
*/
export default function VisionMissionTabs() {
  const [active, setActive] = useState(0)
  const baseId = useId()

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = (active + step + items.length) % items.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-t-4 border-b-4 border-neutral-300 border-t-brand-primary bg-white shadow-md">
      <div
        role="tablist"
        aria-label="Tầm nhìn và sứ mệnh"
        className="hidden border-b border-neutral-200 lg:flex"
      >
        {items.map((item, index) => {
          const selected = index === active
          return (
            <button
              key={item.title}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={handleKeyDown}
              className={`-mb-px flex-1 cursor-pointer border-b-2 px-4 py-4 text-base font-bold tracking-wide uppercase transition-colors outline-none focus-visible:bg-brand-primary-light ${
                selected
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {item.title}
            </button>
          )
        })}
      </div>

      <div className="grid">
        {items.map((item, index) => {
          const Icon = item.icon
          const selected = index === active
          return (
            <div
              key={item.title}
              id={`${baseId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${index}`}
              className={`relative overflow-hidden border-neutral-200 p-8 not-first:border-t transition-opacity duration-300 md:p-10 lg:col-start-1 lg:row-start-1 lg:border-t-0 ${
                selected ? '' : 'lg:invisible lg:opacity-0'
              }`}
            >
              {/* Icon lớn mờ ở góc làm hoạ tiết hình tượng hoá nội dung */}
              <Icon
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-8 size-40 text-brand-primary-light"
              />
              <div className="relative mb-4 flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="mb-0 text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="relative mb-0 text-neutral-700 md:text-lg md:leading-8">{item.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
