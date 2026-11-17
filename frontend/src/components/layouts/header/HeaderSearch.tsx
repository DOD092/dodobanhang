'use client'

import Form from 'next/form'
import { useEffect, useRef } from 'react'

import { SearchIcon } from '@/components/common/Icons'
import { PRODUCTS_PATH } from '@/features/product/productQuery'

interface HeaderSearchProps {
  open: boolean
  onClose: () => void
}

// Ô tìm kiếm thả xuống dưới header, mở bằng nút kính lúp trong Header (state của Header, không
// còn Bootstrap collapse). Gửi form -> /products?q=... bằng next/form (chuyển trang phía client).
export default function HeaderSearch({ open, onClose }: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Mở xong thì focus ô nhập để gõ luôn
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <div className={`border-t border-neutral-200 ${open ? 'block' : 'hidden'}`}>
      <div className="container py-3">
        <Form
          action={PRODUCTS_PATH}
          role="search"
          onSubmit={onClose}
          className="relative mx-auto max-w-2xl"
        >
          <label htmlFor="header-search-input" className="sr-only">
            Tìm sản phẩm
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-400" />
          <input
            ref={inputRef}
            id="header-search-input"
            type="search"
            name="q"
            required
            maxLength={100}
            autoComplete="off"
            placeholder="Bạn cần tìm sản phẩm gì? (vd: thép hộp, inox 304)"
            onKeyDown={(event) => event.key === 'Escape' && onClose()}
            className="form-input h-11 rounded-full ps-12 pe-24"
          />
          <button
            type="submit"
            className="btn btn-primary absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full px-4 py-1.5 text-sm"
          >
            Tìm
          </button>
        </Form>
      </div>
    </div>
  )
}
