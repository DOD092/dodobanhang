import ProductGridSkeleton from '@/components/product/ProductGridSkeleton'

// Hiện ngay khi bấm vào /products (Next prefetch sẵn file này), trong lúc server render trang.
// Nằm trong route group (list) để KHÔNG bọc /products/[slug]: loading.tsx làm trang stream sớm nên
// notFound() của trang chi tiết chỉ trả được mã 200 (soft 404) thay vì 404.
export default function ProductsLoading() {
  return (
    <>
      {/* Cùng khung với ImageBanner (nền tối, cùng chiều cao) để không nháy xám -> tối khi tải xong */}
      <section className="bg-neutral-900">
        <div className="container flex min-h-80 flex-col justify-center pt-10 pb-10 md:min-h-104 md:pb-14 lg:min-h-120">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-white/20" />
          <span className="mb-4 block h-1 w-16 bg-brand-primary" aria-hidden="true" />
          <div className="mb-3 h-10 w-64 animate-pulse rounded bg-white/20 md:h-12" />
          <div className="h-5 w-full max-w-lg animate-pulse rounded bg-white/20" />
          <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-full bg-white/20" />
        </div>
      </section>
      <section className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr] lg:gap-8">
          <div className="hidden lg:block">
            <div className="h-96 animate-pulse rounded-2xl bg-neutral-100" />
          </div>
          <div>
            <ProductGridSkeleton />
          </div>
        </div>
      </section>
    </>
  )
}
