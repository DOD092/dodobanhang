import type { ContentBlock } from '@/types/ContentBlock'
import { toSlug } from '@/utils/slug'

/*
  Slug hoá tiêu đề để làm id neo (#slug) cho mục lục, dùng chung giữa ServiceBody (gắn id lên thẻ
  h2/h3) và ServiceToc (tạo link tới id đó) để 2 nơi luôn ra cùng một chuỗi id.
  Trả về mảng SONG SONG với `blocks`: rỗng ở vị trí không phải heading, id duy nhất ở vị trí heading
  (trùng tiêu đề thì thêm số ở cuối, vd 2 mục "Giới thiệu" -> "gioi-thieu", "gioi-thieu-2").
*/
export function buildHeadingIds(blocks: ContentBlock[]): string[] {
  const seen = new Map<string, number>()

  return blocks.map((block) => {
    if (block.type !== 'heading') return ''

    const base = toSlug(block.text) || 'muc'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  })
}
