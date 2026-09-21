import { cva } from "class-variance-authority";

export const fieldClass = cva("flex w-full flex-col gap-2");

export const controlClass = cva("relative flex w-full items-center");

export const inputVariants = cva(
  "h-11 w-full rounded-12 border border-grey-300 bg-white py-3 pl-4 text-16-m500 text-blue-grey-300 transition-colors outline-none placeholder:text-grey-200 focus:border-grey-400 disabled:cursor-not-allowed disabled:border-grey-200 disabled:bg-grey-100",
  {
    variants: {
      filled: {
        true: "not-focus:border-grey-200 not-focus:bg-grey-000",
        false: "",
      },
      invalid: {
        true: "border-red-100 not-focus:border-red-100 focus:border-red-100",
        false: "",
      },
      trailing: {
        none: "pr-4",
        clear: "pr-15",
        counter: "pr-24",
      },
    },
  },
);

export const trailingSlotClass = cva(
  "pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center",
);

export const clearButtonClass = cva(
  "pointer-events-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70 disabled:cursor-not-allowed disabled:text-grey-200",
);

export const counterClass = cva("text-right text-16-m500 whitespace-nowrap text-grey-300");
