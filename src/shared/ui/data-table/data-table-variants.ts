import { cva } from "class-variance-authority";

export const wrapperClass = cva("overflow-x-auto");

export const tableClass = cva("w-full min-w-160 table-fixed border-separate border-spacing-0");

export const bodyClass = cva("transition-opacity", {
  variants: {
    fetching: {
      true: "opacity-60",
      false: "",
    },
  },
  defaultVariants: { fetching: false },
});

export const headCellClass = cva("h-7.5 text-12-sb600 text-grey-500", {
  variants: {
    align: {
      left: "px-3 text-left",
      center: "px-0 text-center",
    },
    width: {
      auto: "",
      narrow: "w-20",
    },
  },
  defaultVariants: { align: "left", width: "auto" },
});

export const dataCellVariants = cva(
  "h-22.5 text-16-m500 text-blue-grey-300 group-focus-within:bg-grey-000 group-hover:bg-grey-000 first:rounded-l-12 last:rounded-r-12",
  {
    variants: {
      align: {
        left: "px-3",
        center: "px-0 text-center",
      },
    },
    defaultVariants: { align: "left" },
  },
);

export const stateCellClass = cva("h-22.5 px-3 text-center text-16-m500 text-grey-500");

export const stateStackClass = cva("flex flex-col items-center justify-center gap-3");
