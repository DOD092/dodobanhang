import type { ContentBlock } from '@/types/ContentBlock'

import { buildHeadingIds } from './headingIds'

// Mục lục các tiêu đề cấp 2 trong bài (không lấy cấp 3, tránh danh sách quá dài/rối). Chỉ để lấp
// khoảng trống hợp lý bên cạnh cột nội dung hẹp (dòng chữ dài quá khó đọc nên cột nội dung không
// chiếm hết chiều ngang) và giúp nhảy nhanh tới từng phần khi bài dài. Bài ngắn thì ẩn hẳn.
export default function ServiceToc({ blocks }: { blocks: ContentBlock[] }) {
  const ids = buildHeadingIds(blocks)
  const items = blocks
    .map((block, index) => ({ block, id: ids[index] }))
    .filter(
      (entry): entry is { block: Extract<ContentBlock, { type: 'heading' }>; id: string } =>
        entry.block.type === 'heading' && entry.block.level === 2
    )

  if (items.length < 2) return null

  return (
    <nav aria-label="Mục lục" className="rounded-2xl border-2 border-b-4 border-neutral-300 bg-white p-5 shadow-md">
      <h2 className="mb-3 text-sm font-bold tracking-wide text-neutral-900 uppercase">Nội dung</h2>
      <ul className="m-0 list-none space-y-2 p-0 text-sm">
        {items.map(({ block, id }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-neutral-600 no-underline hover:text-brand-primary">
              {block.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
