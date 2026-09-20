/**
 * @constants
 */
const PAGE_WINDOW_SIZE = 5;

export function getPageWindow(page: number, pageCount: number): number[] {
  const total = Math.max(pageCount, 1);
  const size = Math.min(PAGE_WINDOW_SIZE, total);
  const current = Math.min(Math.max(page, 1), total);
  const start = Math.min(Math.max(current - Math.floor(size / 2), 1), total - size + 1);

  return Array.from({ length: size }, (_, index) => start + index);
}
