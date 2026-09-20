import { cva } from "class-variance-authority";

export const groupClass = cva("flex flex-col");

export const itemClass = cva(
  "inline-flex cursor-pointer items-start gap-1 py-1 has-disabled:cursor-not-allowed",
);

export const controlClass = cva("relative inline-flex size-5 shrink-0 items-center justify-center");

export const inputClass = cva(
  "peer absolute inset-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed",
);

export const circleClass = cva(
  "size-4 rounded-full border-[1.5px] border-grey-300 bg-white transition-colors peer-checked:border-0 peer-checked:bg-blue-green-70 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-green-70 peer-disabled:border-grey-200 peer-disabled:bg-grey-200 peer-checked:peer-disabled:bg-grey-300",
);

export const dotClass = cva(
  "pointer-events-none absolute size-2 rounded-full bg-white opacity-0 peer-checked:opacity-100",
);

export const textsClass = cva("flex flex-col gap-1");

export const labelClass = cva("flex min-h-5 items-center text-14-sb600 text-blue-grey-300");

export const subLabelClass = cva("text-12-m500 text-grey-300");
