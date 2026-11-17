import { PRODUCTS_PAGE_SIZE } from '@/features/product/productQuery'

// Khung xương hiển thị trong lúc Server Component đang lấy dữ liệu (Suspense fallback / loading.tsx)
export default function ProductGridSkeleton({ count = PRODUCTS_PAGE_SIZE }: { count?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Đang tải sản phẩm...</span>
      <div className="mb-4 h-5 w-56 animate-pulse rounded bg-neutral-200" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div key={index}>
            <div className="h-full overflow-hidden rounded-2xl border-2 border-b-4 border-neutral-300 bg-white shadow-md">
              <div className="aspect-4/3 animate-pulse bg-neutral-200" />
              <div className="space-y-3 p-[1rem] sm:p-5">
                <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
                <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
