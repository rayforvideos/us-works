import { cva } from "class-variance-authority";

export const boxVariants = cva(
  "relative flex h-11 w-full items-center rounded-12 border border-grey-300 bg-white px-4 py-3 text-16-m500 transition-colors has-focus-visible:border-grey-400",
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed border-grey-200 bg-grey-100",
        false: "",
      },
      invalid: {
        true: "border-red-100 has-focus-visible:border-red-100",
        false: "",
      },
    },
  },
);

export const valueVariants = cva("truncate text-16-m500", {
  variants: {
    filled: {
      true: "text-blue-grey-300",
      false: "text-grey-200",
    },
  },
});

export const overlayInputClass = cva(
  "absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none disabled:cursor-not-allowed",
);
