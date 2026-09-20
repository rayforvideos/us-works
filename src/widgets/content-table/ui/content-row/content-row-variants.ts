import { cva } from "class-variance-authority";

export const rowClass = cva("group cursor-pointer");

export const cellClass = cva(
  "h-22.5 px-3 text-16-m500 text-blue-grey-300 group-focus-within:bg-grey-000 group-hover:bg-grey-000 first:rounded-l-12 last:rounded-r-12",
);

export const centeredCellClass = cva("px-0 text-center");

export const titleRowClass = cva("flex items-center gap-2");

export const titleLinkClass = cva(
  "min-w-0 truncate text-16-sb600 text-blue-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70",
);

export const pushLinkClass = cva(
  "invisible ml-auto shrink-0 group-focus-within:visible group-hover:visible",
);

export const dateStackClass = cva("flex flex-col items-center gap-1 text-12-m500 text-grey-500");
