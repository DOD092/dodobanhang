'use client'

import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { SearchIcon, XIcon } from '@/components/common/Icons'
import {
  PRODUCTS_PATH,
  buildProductsHref,
  defaultProductQuery,
  type ProductQuery,
} from '@/features/product/productQuery'

const DEBOUNCE_MS = 300

/*
  Ô tìm kiếm sản phẩm:
  - Gõ tới đâu lọc tới đó: sau 300ms ngừng gõ thì cập nhật ?q= trên URL (router.replace, không
    thêm lịch sử), Server Component lọc lại. Không fetch dữ liệu ở client.
  - Bấm Enter: <Form> của next/form gửi GET tới /products (vẫn chạy khi JS chưa tải xong).
*/
export default function ProductSearch({ query }: { query: ProductQuery }) {
  const router = useRouter()
  const [value, setValue] = useState(query.q)
  const [isPending, startTransition] = useTransition()
  const lastSent = useRef(query.q)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // URL đổi từ nơi khác (nút "Xóa bộ lọc", Back/Forward) thì đồng bộ lại ô nhập.
  // Bỏ qua khi URL chỉ vừa cập nhật theo chính chữ người dùng gõ, để không ghi đè chữ đang gõ.
  useEffect(() => {
    if (query.q !== lastSent.current) {
      lastSent.current = query.q
      setValue(query.q)
    }
  }, [query.q])

  useEffect(() => () => clearTimeout(timer.current), [])

  function navigate(q: string) {
    clearTimeout(timer.current)
    lastSent.current = q
    startTransition(() => {
      router.replace(buildProductsHref(query, { q }), { scroll: false })
    })
  }

  function handleChange(next: string) {
    setValue(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => navigate(next.trim()), DEBOUNCE_MS)
  }

  return (
    <Form
      action={PRODUCTS_PATH}
      role="search"
      scroll={false}
      onSubmit={() => {
        clearTimeout(timer.current)
        lastSent.current = value.trim()
      }}
      className="relative"
    >
      {/* Giữ các bộ lọc khác khi gửi form bằng Enter */}
      {query.category !== null && <input type="hidden" name="category" value={query.category} />}
      {query.price && <input type="hidden" name="price" value={query.price} />}
      {query.sort !== defaultProductQuery.sort && (
        <input type="hidden" name="sort" value={query.sort} />
      )}

      <label htmlFor="product-search" className="sr-only">
        Tìm sản phẩm
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-400" />
      <input
        id="product-search"
        type="search"
        name="q"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            setValue('')
            navigate('')
          }
        }}
        placeholder="Tìm theo tên sản phẩm, tác giả, mã SKU..."
        autoComplete="off"
        maxLength={100}
        className="form-input h-12 rounded-full ps-12 pe-24 shadow-sm [&::-webkit-search-cancel-button]:hidden"
      />

      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-x-1">
        {isPending && (
          <span
            className="me-1 size-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent"
            role="status"
            aria-label="Đang tìm"
          />
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('')
              navigate('')
            }}
            aria-label="Xóa từ khóa"
            className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <XIcon className="size-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="btn btn-primary flex size-9 items-center justify-center rounded-full p-0"
        >
          <SearchIcon className="size-4" strokeWidth={2} />
        </button>
      </div>
    </Form>
  )
}
