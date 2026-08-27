export function formatDateTime(
  date: Date,
  pattern: 'iso' | 'display' = 'iso',
): string {
  if (pattern === 'iso') {
    return date.toISOString();
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
