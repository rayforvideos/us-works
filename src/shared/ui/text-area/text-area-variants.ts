import { cva } from "class-variance-authority";

export const fieldClass = cva("flex w-full flex-col gap-2");

export const boxVariants = cva(
  "flex min-h-19.5 w-full flex-col gap-2 rounded-12 border border-grey-300 bg-white p-4 transition-colors has-focus-within:border-grey-400 has-disabled:border-grey-200 has-disabled:bg-grey-100",
  {
    variants: {
      invalid: {
        true: "border-red-100 has-focus-within:border-red-100",
        false: "",
      },
    },
  },
);

export const textareaClass = cva(
  "field-sizing-content w-full resize-none overflow-hidden bg-transparent text-16-m500 text-blue-grey-300 outline-none placeholder:text-grey-200 disabled:cursor-not-allowed",
);

export const counterClass = cva("text-right text-16-m500 text-grey-300");

export const errorTextClass = cva("min-h-3 text-12-r400 text-red-100");
