import { coreValues } from '@/config/home'

import { coreValueIcons } from './coreValueIcons'

// Khung "Giá trị cốt lõi": nền đen, icon trong vòng tròn đỏ. Bản đầy đủ hơn (panel mở rộng khi rê
// chuột, components/about/CoreValuePanels.tsx) nằm ở trang /about; khung này tóm tắt gọn cho trang chủ.
export default function CoreValues() {
  return (
    <div className="h-full rounded-3xl bg-neutral-950 p-6 text-white md:p-8">
      <h2 className="mb-6 border-l-4 border-brand-primary pl-3 text-2xl font-bold">
        Giá trị cốt lõi
      </h2>
      <ol className="m-0 list-none space-y-5 p-0">
        {coreValues.map((item) => {
          const Icon = coreValueIcons[item.icon]
          return (
            <li key={item.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="mb-0 text-sm text-neutral-300">{item.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
