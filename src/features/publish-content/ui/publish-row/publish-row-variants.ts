import { cva } from "class-variance-authority";

export const rowClass = cva("flex gap-7", {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
    },
  },
  defaultVariants: { align: "start" },
});

export const labelClass = cva("w-15 shrink-0 text-16-sb600 whitespace-nowrap text-blue-grey-300");

export const controlClass = cva("flex min-w-0 flex-1 flex-col gap-1");
