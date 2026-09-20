import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex h-6 items-center gap-0.5 rounded-8 p-1.5 text-12-sb600 whitespace-nowrap",
  {
    variants: {
      tone: {
        green: "bg-blue-green-10 text-blue-green-70",
        red: "bg-red-10 text-red-100",
        yellow: "bg-yellow-10 text-yellow-100",
        grey: "bg-grey-100 text-grey-500",
      },
    },
  },
);

export const dotSlotClass = cva("inline-flex size-2 shrink-0 items-center justify-center");

export const dotVariants = cva("rounded-full bg-current", {
  variants: {
    tone: {
      green: "size-[4.8px]",
      red: "size-[4.8px]",
      yellow: "size-[4.8px]",
      grey: "size-1.5",
    },
  },
});
