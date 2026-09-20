import { cva } from "class-variance-authority";

export const backdropClass = cva(
  "fixed inset-0 bg-black/60 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
);

export const popupClass = cva(
  "fixed top-1/2 left-1/2 w-121 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-20 bg-white shadow-200 transition-[opacity,scale] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
);

export const headerClass = cva("flex items-center justify-between border-b border-grey-200 p-6");

export const titleClass = cva("text-18-b700 text-blue-grey-300");

export const closeClass = cva(
  "flex size-6 cursor-pointer items-center justify-center text-blue-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70",
);

export const bodyClass = cva("px-6 py-2");
