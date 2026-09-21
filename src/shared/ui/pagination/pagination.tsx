import { cn } from "@/shared/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icon";

import { getPageWindow } from "./page-window";
import { itemClass, navClass } from "./pagination-variants";

/**
 * @types
 */
type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const lastPage = Math.max(pageCount, 1);
  const currentPage = Math.min(Math.max(page, 1), lastPage);

  return (
    <nav aria-label="페이지" className={cn(navClass(), className)}>
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        className={itemClass()}
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
      >
        <ChevronLeftIcon />
      </button>
      {getPageWindow(currentPage, lastPage).map((number) => (
        <button
          key={number}
          type="button"
          aria-label={`${number}페이지`}
          aria-current={number === currentPage ? "page" : undefined}
          className={itemClass()}
          onClick={() => {
            onPageChange(number);
          }}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= lastPage}
        className={itemClass()}
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
