import Image from 'next/image'

import { StarIcon, UserIcon } from '@/components/common/Icons'
import type { Review } from '@/types/Review'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          fill="currentColor"
          className={`size-4 ${star <= rating ? 'text-brand-primary' : 'text-neutral-300'}`}
        />
      ))}
    </div>
  )
}

// Che tên khách như sàn TMĐT ("nguyenanh" -> "n*****h") để không lộ danh tính đầy đủ
function maskName(name: string) {
  const trimmed = name.trim()
  if (trimmed.length <= 2) return trimmed
  return `${trimmed[0]}*****${trimmed[trimmed.length - 1]}`
}

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/*
  Khung "Đánh giá từ khách hàng", định dạng theo kiểu đánh giá trên sàn TMĐT: ảnh đại diện mặc định
  + tên (che bớt) + sao, rồi ngày, nội dung, hàng ảnh thực tế bên dưới.
  Phần nào dữ liệu không có thì không hiện (không có tên thì ghi nhãn chung "Khách hàng"); không tự
  điền tên, sao hay ngày thay khách. Bấm ảnh để mở ảnh gốc ở tab mới.
*/
export default function CustomerReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="h-full rounded-3xl border-2 border-b-4 border-neutral-300 bg-white p-6 shadow-md md:p-8">
      <h2 className="mb-6 border-l-4 border-brand-primary pl-3 text-2xl font-bold">
        Đánh giá từ khách hàng
      </h2>
      <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
        {reviews.map((review) => {
          const date = review.created_at ? formatDate(review.created_at) : null
          return (
            <li key={review.id} className="flex gap-3 py-5 first:pt-0 last:pb-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <UserIcon className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-semibold text-neutral-900">
                  {review.customer_name ? maskName(review.customer_name) : 'Khách hàng'}
                </p>
                {review.rating !== undefined && <Stars rating={review.rating} />}
                {date && <p className="mt-1 mb-0 text-xs text-neutral-500">{date}</p>}

                <p className="mt-2 mb-0 text-neutral-800">{review.content}</p>

                {review.images.length > 0 && (
                  <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                    {review.images.map((src, index) => (
                      <li key={src}>
                        <a
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block size-20 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200 transition hover:ring-brand-primary"
                        >
                          <Image
                            src={src}
                            alt={`Ảnh thực tế ${index + 1} kèm đánh giá của khách hàng`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
