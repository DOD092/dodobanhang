// Hàng 5 sao, tô theo điểm (vd 4.7 = 4 sao đầy + 70% sao thứ 5). Lớp sao vàng đè lên lớp sao xám,
// cắt theo bề rộng % -> không cần SVG riêng cho nửa sao.
export default function StarRating({
  value,
  className = 'text-sm',
}: {
  value: number
  className?: string
}) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span
      role="img"
      aria-label={`${value.toLocaleString('vi-VN')} trên 5 sao`}
      className={`relative inline-block leading-none tracking-tight whitespace-nowrap ${className}`}
    >
      <span className="text-neutral-300" aria-hidden="true">
        ★★★★★
      </span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-amber-400"
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      >
        ★★★★★
      </span>
    </span>
  )
}

// "Đã bán 10k+" kiểu sàn TMĐT: số lớn rút gọn cho vừa thẻ
export function formatSold(count: number): string {
  if (count >= 1000) {
    const k = Math.floor(count / 100) / 10
    return `${k.toLocaleString('vi-VN')}k`
  }
  return String(count)
}
