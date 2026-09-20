import { cva } from "class-variance-authority";

export const navClass = cva("flex items-center justify-center gap-1");

export const itemClass = cva(
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-8 text-16-sb600 text-grey-400 outline-none hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70 disabled:cursor-not-allowed disabled:text-grey-300 aria-[current=page]:text-16-ex800 aria-[current=page]:text-blue-grey-300",
);
