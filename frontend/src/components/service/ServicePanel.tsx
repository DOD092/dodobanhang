import Link from 'next/link'

import { ArrowRightIcon, CheckIcon } from '@/components/common/Icons'
import type { Service } from '@/types/Service'
import { slugPath } from '@/utils/slug'

import { getServiceIcon } from './serviceIcons'

/*
  Panel dịch vụ trên trang /services. Hiệu ứng thuần CSS (không cần JS, vẫn là Server Component):
  - >= lg: các panel xếp ngang, cao cố định. Rê chuột (hover) hoặc focus (Tab tới nút, chạm trên
    tablet nhờ tabIndex={-1}) vào panel nào thì panel đó giãn ra (flex-grow 1 -> 2), đổi nền đen
    và trượt ra danh sách chi tiết (grid-rows 0fr -> 1fr). Panel còn lại tự co lại.
  - < lg: không có hover nên xếp dọc, luôn hiện chi tiết.
  Lưu ý: `hover:` của Tailwind 4 chỉ áp dụng trên thiết bị có chuột (@media (hover: hover)).
  Không dùng `bg-white` cho panel: đó là class Bootstrap có !important, sẽ chặn nền đen khi mở.
*/
export default function ServicePanel({ service }: { service: Service }) {
  const Icon = getServiceIcon(service.id)

  return (
    <li
      tabIndex={-1}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border-2 border-t-4 border-b-4 border-neutral-300 border-t-brand-primary p-6 shadow-md outline-none transition-all duration-500 ease-out sm:p-8 lg:flex-1 lg:p-6 xl:p-8 lg:focus-within:flex-2 lg:focus-within:border-brand-primary lg:focus-within:border-t-brand-accent lg:focus-within:bg-brand-primary lg:focus-within:text-white lg:focus-within:shadow-xl lg:hover:flex-2 lg:hover:border-brand-primary lg:hover:border-t-brand-accent lg:hover:bg-brand-primary lg:hover:text-white lg:hover:shadow-xl"
    >
      <span className="relative mb-6 flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-colors duration-500 lg:group-focus-within:bg-brand-accent lg:group-focus-within:text-brand-primary lg:group-hover:bg-brand-accent lg:group-hover:text-brand-primary">
        <Icon className="size-8" />
      </span>

      <h2 className="relative mb-3 text-xl font-bold md:text-2xl">{service.name}</h2>
      <p className="relative mb-0 text-neutral-600 transition-colors duration-500 lg:group-focus-within:text-neutral-300 lg:group-hover:text-neutral-300">
        {service.description}
      </p>

      {/* Chi tiết: grid-rows 0fr -> 1fr để trượt mở mượt (height: auto không animate được).
          Dịch vụ chưa có hạng mục chi tiết thì không render khối này (tránh khoảng trống thừa). */}
      {service.details.length > 0 && (
        <div className="grid grid-rows-[1fr] transition-all duration-500 ease-out lg:grid-rows-[0fr] lg:opacity-0 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100">
          <div className="overflow-hidden">
            {/* min-w: chữ không bị xuống dòng liên tục trong lúc panel đang giãn */}
            <ul className="mt-6 mb-0 list-none space-y-3 p-0 lg:min-w-96">
              {service.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-x-3 text-sm text-neutral-700 lg:text-neutral-200"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
                    <CheckIcon className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Cả panel bấm được để vào trang chi tiết: `after:absolute after:inset-0` của link "Xem chi
          tiết" phủ lên toàn bộ <li> (li có `relative`, nên wrapper này KHÔNG được có `relative`).
          Nút "Tư vấn ngay" có `relative z-10` để nổi lên trên lớp phủ và vẫn bấm riêng được. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
        <Link
          href={slugPath('/services', service)}
          aria-label={`Xem chi tiết ${service.name}`}
          className="inline-flex items-center gap-x-1 text-sm font-semibold whitespace-nowrap text-neutral-900 no-underline transition-colors duration-500 after:absolute after:inset-0 lg:group-focus-within:text-white lg:group-hover:text-white"
        >
          Xem chi tiết
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/contact"
          aria-label={`Tư vấn ngay về ${service.name}`}
          className="btn btn-primary relative z-10 inline-flex items-center rounded-full px-6 py-2 font-semibold whitespace-nowrap"
        >
          Tư vấn ngay
        </Link>
      </div>
    </li>
  )
}
