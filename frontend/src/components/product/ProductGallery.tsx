'use client'

import Image from 'next/image'
import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/Icons'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

// Gallery ảnh sản phẩm kiểu Shopee: ảnh lớn + nút qua trái/phải + dải ảnh nhỏ bên dưới để chọn
// nhanh. Chỉ 1 ảnh thì không có nút/dải ảnh, y hệt ảnh tĩnh như trước.
export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const hasMultiple = images.length > 1

  function go(delta: number) {
    setActive((current) => (current + delta + images.length) % images.length)
  }

  return (
    <div>
      <div className="group relative aspect-4/3 overflow-hidden rounded-3xl border-2 border-b-4 border-neutral-300 bg-neutral-100 shadow-md">
        {/* Ảnh chính nằm ngay màn hình đầu: preload để hiện nhanh (LCP) */}
        <Image
          src={images[active]}
          alt={alt}
          fill
          preload
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-1"
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
              className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh sau"
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Xem ảnh ${index + 1}`}
              aria-current={index === active}
              className={`relative aspect-square size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 transition-colors ${
                index === active
                  ? 'border-brand-primary'
                  : 'border-transparent hover:border-neutral-300'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
