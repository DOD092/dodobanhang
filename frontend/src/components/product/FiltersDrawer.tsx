'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { FilterIcon, XIcon } from '@/components/common/Icons'

/*
  Bộ lọc sản phẩm, thay cho Bootstrap offcanvas-lg. Dùng Context vì nút bấm "Bộ lọc" (cạnh ô sắp
  xếp) và khung chứa bộ lọc (cột trái) nằm ở 2 vị trí khác nhau trong layout nhưng phải dùng chung
  trạng thái đóng/mở:
  - Mobile (< lg): nút "Bộ lọc" mở khung trượt từ trái, có lớp phủ (backdrop) và nút đóng.
  - Desktop (>= lg): khung hiện tĩnh tại chỗ (sticky sidebar), không có backdrop/header, bỏ qua
    state `open` (lớp `lg:translate-x-0 lg:static` luôn thắng ở đó); nút "Bộ lọc" ẩn hẳn (`lg:hidden`).
*/
const DrawerContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(
  null
)

function useDrawerContext() {
  const context = useContext(DrawerContext)
  if (!context) throw new Error('FiltersDrawer.Trigger/Panel phải nằm trong FiltersDrawer.Root')
  return context
}

// Đổi `watchKey` (vd: URL bộ lọc đổi sau khi bấm một lựa chọn) thì tự đóng, thay cho
// OffcanvasAutoClose trước đây (theo dõi qua prop thay vì đọc URL bằng hook client).
export function Root({ watchKey, children }: { watchKey: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [watchKey])

  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>
}

export function Trigger({ activeFilterCount }: { activeFilterCount: number }) {
  const { setOpen } = useDrawerContext()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      className="btn btn-outline-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm lg:hidden"
    >
      <FilterIcon className="size-4" />
      Bộ lọc
      {activeFilterCount > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs text-white">
          {activeFilterCount}
        </span>
      )}
    </button>
  )
}

export function Panel({ children }: { children: ReactNode }) {
  const { open, setOpen } = useDrawerContext()

  return (
    <>
      {/* Lớp phủ: chỉ hiện ở mobile lúc mở, bấm vào để đóng */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-neutral-950/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Bộ lọc sản phẩm"
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white transition-transform duration-300 ease-out lg:sticky lg:top-24 lg:z-auto lg:max-h-[calc(100vh-7rem)] lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-y-auto lg:rounded-xl lg:bg-white lg:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 lg:hidden">
          <h2 className="text-lg font-bold">Bộ lọc</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng bộ lọc"
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Desktop: khung trắng bo góc cùng kiểu các khung khác của trang /products; cột dài hơn màn
            hình thì tự cuộn (max-h + overflow-y-auto ở aside) */}
        <div className="flex w-full flex-col gap-y-8 p-4">{children}</div>
      </aside>
    </>
  )
}
