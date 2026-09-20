import { cva } from "class-variance-authority";

export const rowClass = cva("group cursor-pointer");

export const titleRowClass = cva("flex items-center gap-2");

export const titleLinkClass = cva(
  "min-w-0 truncate text-16-sb600 text-blue-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70",
);

export const dateStackClass = cva("flex flex-col items-center gap-1 text-12-m500 text-grey-500");
