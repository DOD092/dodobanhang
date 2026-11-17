import Image from 'next/image'

import type { ContentBlock } from '@/types/ContentBlock'

import { buildHeadingIds } from './headingIds'

// Vẽ một khối nội dung. Đổi giao diện của từng loại khối thì sửa ở đây, dữ liệu không phải đổi.
// `id`: chỉ heading mới có, dùng làm điểm neo cho ServiceToc; `scroll-mt-24` chừa chỗ cho header dính.
function Block({ block, id }: { block: ContentBlock; id?: string }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2 id={id} className="mt-10 mb-3 scroll-mt-24 text-2xl font-bold first:mt-0 md:text-3xl">
          {block.text}
        </h2>
      ) : (
        <h3 id={id} className="mt-8 mb-2 scroll-mt-24 text-xl font-bold first:mt-0">
          {block.text}
        </h3>
      )

    case 'paragraph':
      return <p className="mb-4 text-neutral-700 md:text-lg md:leading-8">{block.text}</p>

    case 'list': {
      const ListTag = block.style === 'ordered' ? 'ol' : 'ul'
      const listStyle = block.style === 'ordered' ? 'list-decimal' : 'list-disc'
      return (
        <ListTag
          className={`mb-4 space-y-2 pl-6 text-neutral-700 marker:text-brand-primary md:text-lg ${listStyle}`}
        >
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      )
    }

    case 'image':
      return (
        <figure className="my-8">
          {/* width/height gốc giúp next/image giữ chỗ, trang không bị giật khi ảnh tải xong */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="h-auto w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    default:
      // Loại khối chưa biết (dữ liệu mới hơn code): bỏ qua thay vì làm vỡ cả trang
      return null
  }
}

// Thân bài trang chi tiết: duyệt mảng khối `content` và vẽ lần lượt
export default function ServiceBody({ blocks }: { blocks: ContentBlock[] }) {
  const headingIds = buildHeadingIds(blocks)

  return (
    <div>
      {blocks.map((block, index) => (
        <Block key={index} block={block} id={headingIds[index] || undefined} />
      ))}
    </div>
  )
}
