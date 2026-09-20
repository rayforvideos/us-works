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

export const headCellClass = cva("h-7.5 px-3 text-left text-12-sb600 text-grey-500");

export const numberColumnClass = cva("w-20");

export const dateColumnClass = cva("w-20 px-0 text-center");

export const statusColumnClass = cva("w-20 px-0 text-center");

export const stateCellClass = cva("h-22.5 px-3 text-center text-16-m500 text-grey-500");

export const stateStackClass = cva("flex flex-col items-center justify-center gap-3");
