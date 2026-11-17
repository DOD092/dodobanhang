import type { ReactNode } from 'react'

// Mỗi nửa dải phải dài hơn màn hình rộng nhất, nếu không lúc lặp sẽ lộ khoảng trống bên phải.
// Ít phần tử thì lặp lại cho đủ số này (thẻ ~320px x 6 > 1920px).
const MIN_ITEMS_PER_HALF = 6

interface MarqueeProps {
  items: ReactNode[]
  label: string // tên vùng cho trình đọc màn hình
  secondsPerItem?: number // tốc độ: thời gian để 1 thẻ trôi qua, nên đổi số thẻ vẫn giữ tốc độ
}

/*
  Băng chuyền chạy ngang vô tận, thuần CSS (Server Component, không cần JS):
  - Dải gồm 2 nửa giống hệt nhau, chạy `animate-marquee` (translateX 0 -> -50%, xem globals.css) rồi
    lặp lại: hết 1 vòng thì nửa sau nằm đúng chỗ nửa đầu nên không thấy chỗ nối. Mỗi nửa có `pr-*`
    bằng `gap-*` để khoảng cách ở chỗ nối bằng khoảng cách giữa các thẻ.
  - Rê chuột vào dải hoặc Tab tới phần tử bên trong thì dừng (`animation-play-state: paused`).
    Trên màn hình cảm ứng (không có hover) dải vẫn chạy.
  - Bản lặp được đánh dấu `inert`: trình đọc màn hình chỉ đọc 1 lần, phím Tab không đi vào bản lặp.
  - Người dùng bật "giảm chuyển động" trong hệ điều hành: không chạy, ẩn bản lặp, thành dải cuộn
    ngang bằng tay.
  - Mép trái/phải mờ dần (mask-image) để thẻ trôi vào/ra mượt, không bị cắt cụt.
*/
export default function Marquee({ items, label, secondsPerItem = 8 }: MarqueeProps) {
  if (items.length === 0) return null

  const repeat = Math.ceil(MIN_ITEMS_PER_HALF / items.length)
  const half = Array.from({ length: repeat }, () => items).flat()

  return (
    <div
      role="region"
      aria-label={label}
      className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] motion-reduce:overflow-x-auto"
    >
      <div
        className="flex w-max animate-marquee focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${half.length * secondsPerItem}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="m-0 flex shrink-0 list-none gap-6 p-0 pr-6">
            {half.map((item, index) => {
              const duplicate = copy === 1 || index >= items.length
              return (
                <li
                  key={index}
                  inert={duplicate}
                  className={`flex w-72 shrink-0 sm:w-80 ${duplicate ? 'motion-reduce:hidden' : ''}`}
                >
                  {item}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}
