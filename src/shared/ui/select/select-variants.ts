import { cva } from "class-variance-authority";

export const triggerClass = cva(
  "group flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-12 border border-grey-300 bg-white px-3 text-16-m500 text-blue-grey-300 transition-colors outline-none focus-visible:border-grey-400 data-disabled:cursor-not-allowed data-disabled:border-grey-200 data-disabled:bg-grey-100 data-disabled:text-grey-300 data-placeholder:text-grey-200 data-popup-open:border-grey-400",
);

export const valueClass = cva("truncate");

export const iconClass = cva(
  "flex shrink-0 text-blue-green-20 transition-transform duration-150 group-data-disabled:text-grey-200 group-data-popup-open:rotate-180 group-data-disabled:[&_path]:stroke-grey-300",
);

export const positionerClass = cva("z-10 w-(--anchor-width) outline-none");

export const popupClass = cva(
  "max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-12 border border-grey-200 bg-white p-2 shadow-100 transition-[opacity,scale] duration-150 outline-none data-closed:pointer-events-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
);

export const itemClass = cva(
  "flex h-8.25 cursor-pointer items-center rounded-6 px-4 text-14-sb600 text-blue-grey-300 outline-none select-none data-disabled:cursor-not-allowed data-disabled:text-grey-300 data-highlighted:bg-blue-green-10 data-selected:bg-blue-green-10",
);
