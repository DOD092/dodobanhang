import { OrderIcon, ThumbsUpIcon, TruckIcon } from '@/components/common/Icons'
import { highlights, type Highlight } from '@/config/home'

const icons: Record<Highlight['icon'], typeof OrderIcon> = {
  order: OrderIcon,
  experience: ThumbsUpIcon,
  shipping: TruckIcon,
}

// Thẻ trắng chứa 3 điểm nổi bật (viền trên đỏ, mobile xếp dọc, >= md 3 cột). Dùng chung ở trang
// chủ (đè mép dưới ảnh bìa) và trang Giới thiệu (đè mép dưới ảnh công ty); nơi dùng tự đặt -mt-*.
// compact: >= lg icon nằm ngang cạnh số thay vì xếp trên số, thẻ thấp đi ~1/2 (trang chủ dùng để
// ảnh bìa + thẻ vừa 1 màn hình).
export function HighlightsList({
  className = '',
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <ul
      className={`m-0 grid list-none grid-cols-1 divide-y divide-neutral-200 overflow-hidden rounded-2xl border-2 border-t-4 border-b-4 border-neutral-300 border-t-brand-primary bg-white p-0 shadow-lg md:grid-cols-3 md:divide-x md:divide-y-0 ${className}`}
    >
      {highlights.map((item) => {
        const Icon = icons[item.icon]
        return (
          <li
            key={item.icon}
            className={`flex items-center gap-y-3 px-5 ${
              compact
                ? 'gap-x-5 py-5 md:flex-col md:py-6 md:text-center lg:flex-row lg:justify-center lg:py-8 lg:text-left'
                : 'gap-x-4 py-4 md:flex-col md:py-7 md:text-center'
            }`}
          >
            {/* compact (trang chủ) to hơn bản thường: icon, số và nhãn đều lớn hơn 1 cấp */}
            <span
              className={`flex shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary ${
                compact ? 'size-16 lg:size-18' : 'size-14'
              }`}
            >
              <Icon className={compact ? 'size-8 lg:size-9' : 'size-7'} />
            </span>
            <p className="mb-0 leading-snug">
              <span
                className={`block font-bold text-brand-primary ${
                  compact ? 'text-3xl lg:text-4xl' : 'text-2xl'
                }`}
              >
                {item.value}
              </span>
              <span className={`text-neutral-700 ${compact ? 'text-lg' : ''}`}>{item.label}</span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}

// Dải 3 điểm nổi bật ở trang chủ, đè lên dải trống ở mép dưới ảnh bìa. Chỉ đè phần trống dưới 4
// biểu tượng của ảnh (~6% chiều cao ảnh; ảnh tràn ngang cao 540/1360 = 39.7vw, nên ~2.5vw; dùng
// 2vw để chừa chút khoảng cách), đè sâu hơn sẽ che 4 biểu tượng. Đổi ảnh bìa thì tính lại số này.
// `overlap={false}` khi trang chủ không có ảnh bìa: không đè lên gì, chỉ chừa khoảng cách phía trên.
export default function Highlights({ overlap = true }: { overlap?: boolean }) {
  return (
    <section
      aria-label="Điểm nổi bật"
      className={`relative z-10 container ${overlap ? '-mt-[2vw]' : 'pt-10'}`}
    >
      <HighlightsList compact />
    </section>
  )
}
