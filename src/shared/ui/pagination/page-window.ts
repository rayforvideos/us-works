/**
 * @types
 */
type PageWindow = {
  current: number;
  lastPage: number;
  pages: number[];
};

/**
 * @constants
 */
const PAGE_WINDOW_SIZE = 5;

export function getPageWindow(page: number, pageCount: number): PageWindow {
  const lastPage = Math.max(pageCount, 1);
  const size = Math.min(PAGE_WINDOW_SIZE, lastPage);
  const current = Math.min(Math.max(page, 1), lastPage);
  const start = Math.min(Math.max(current - Math.floor(size / 2), 1), lastPage - size + 1);

  return {
    current,
    lastPage,
    pages: Array.from({ length: size }, (_, index) => start + index),
  };
}
