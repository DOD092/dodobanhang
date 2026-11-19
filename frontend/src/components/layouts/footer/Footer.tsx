import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  ClockIcon,
  FacebookIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
} from '@/components/common/Icons'
import { mapUrl, navItems, siteConfig } from '@/config/site'

// Một dòng liên hệ: icon xanh trong vòng tròn vàng (accent) + nội dung
function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-x-3">
      <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-primary">
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </li>
  )
}

const socialClass =
  'flex h-9 items-center justify-center rounded-full border border-white/25 text-sm font-semibold text-neutral-100 no-underline transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-brand-primary'

export default function Footer() {
  const { zalo, facebook } = siteConfig.socials

  return (
    <footer className="mt-auto border-t-4 border-brand-accent bg-brand-primary text-neutral-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-5">
            {/* Icon app nền vàng (cắt từ bộ nhận diện) nổi trên nền xanh của footer */}
            <Image
              src="/images/brand/dodo-icon-yellow.png"
              alt=""
              width={56}
              height={56}
              className="mb-4 size-14"
            />
            <h2 className="mb-4 text-lg leading-snug font-bold text-white">{siteConfig.name}</h2>
            <p className="mb-6 text-sm text-white/75">{siteConfig.description}</p>

            {(zalo || facebook) && (
              <ul className="m-0 flex list-none gap-x-3 p-0" aria-label="Mạng xã hội">
                {zalo && (
                  <li>
                    <a
                      href={zalo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Nhắn tin Zalo"
                      className={`${socialClass} px-4`}
                    >
                      Zalo
                    </a>
                  </li>
                )}
                {facebook && (
                  <li>
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className={`${socialClass} w-9`}
                    >
                      <FacebookIcon className="size-4" />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-3 text-base font-semibold text-white">Liên kết</h3>
            {/* Mobile: các link nằm ngang, tự xuống dòng; desktop: danh sách dọc */}
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm md:flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/75 no-underline hover:text-brand-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-3 text-base font-semibold text-white">Liên hệ</h3>
            <ul className="m-0 list-none space-y-3 p-0 text-sm text-white/75">
              <ContactRow icon={<PhoneCallIcon className="size-3" strokeWidth={2.25} />}>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-inherit no-underline hover:text-white"
                >
                  {siteConfig.phone}
                </a>
              </ContactRow>
              <ContactRow icon={<MailIcon className="size-3" strokeWidth={2.25} />}>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-inherit no-underline hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </ContactRow>
              <ContactRow icon={<MapPinIcon className="size-3" strokeWidth={2.25} />}>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inherit no-underline hover:text-white"
                >
                  {siteConfig.address}
                </a>
              </ContactRow>
              <ContactRow icon={<ClockIcon className="size-3" strokeWidth={2.25} />}>
                Giờ làm việc: {siteConfig.hours}
              </ContactRow>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {siteConfig.name}. Bảo lưu mọi quyền.
      </div>
    </footer>
  )
}
