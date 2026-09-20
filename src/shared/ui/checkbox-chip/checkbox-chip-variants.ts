import { cva } from "class-variance-authority";

export const chipVariants = cva(
  "inline-flex h-8.5 shrink-0 cursor-pointer items-center gap-0.5 rounded-12 border p-2 text-12-b700 whitespace-nowrap transition-colors has-checked:border-blue-green-80 has-checked:bg-blue-green-10 has-checked:text-blue-green-80 has-disabled:cursor-not-allowed has-disabled:border-grey-200 has-disabled:bg-grey-200 has-disabled:text-grey-300",
  {
    variants: {
      shape: {
        solid: "border-transparent bg-blue-green-10 text-blue-green-100",
        outlined: "border-grey-200 bg-white text-blue-grey-300",
      },
    },
  },
);
