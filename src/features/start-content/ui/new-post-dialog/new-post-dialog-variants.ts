import { cva } from "class-variance-authority";

export const listClass = cva("flex flex-col");

export const itemClass = cva("border-b border-grey-200 last:border-b-0");

export const optionButtonClass = cva(
  "group flex w-full cursor-pointer items-center gap-4 py-6 text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-green-70",
);

export const optionIconClass = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-full text-blue-grey-300 group-hover:bg-blue-green-20 group-focus-visible:bg-blue-green-20",
);

export const optionTextsClass = cva("flex flex-col gap-1.5");

export const optionTitleClass = cva("text-16-ex800 text-blue-grey-300");

export const optionDescriptionClass = cva("text-14-m500 text-grey-400");
