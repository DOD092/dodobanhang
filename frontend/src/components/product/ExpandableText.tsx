'use client'

import { useState } from 'react'

// Mô tả dài (sách: vài nghìn ký tự): thu gọn + lớp mờ, bấm "Xem thêm" để mở. Giữ xuống dòng của dữ liệu.
export default function ExpandableText({
  text,
  collapsedHeight = 320,
}: {
  text: string
  collapsedHeight?: number
}) {
  const [open, setOpen] = useState(false)
  const long = text.length > 600

  return (
    <div>
      <div
        className="relative overflow-hidden text-sm leading-relaxed whitespace-pre-line text-neutral-800 md:text-base"
        style={!open && long ? { maxHeight: collapsedHeight } : undefined}
      >
        {text}
        {!open && long && (
          <span className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
        )}
      </div>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mx-auto mt-3 block rounded-lg border border-brand-primary px-5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary-light"
        >
          {open ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  )
}
