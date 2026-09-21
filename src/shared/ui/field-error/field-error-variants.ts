import { cva } from "class-variance-authority";

export const fieldErrorClass = cva("text-12-r400 text-red-100", {
  variants: {
    reserve: {
      true: "min-h-3",
      false: "",
    },
  },
  defaultVariants: { reserve: true },
});
