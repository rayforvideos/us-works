import { cva } from "class-variance-authority";

export const boxVariants = cva(
  "flex h-11 w-full cursor-pointer items-center rounded-12 border border-grey-300 bg-white px-4 py-3 text-16-m500 transition-colors outline-none focus-visible:border-grey-400",
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed border-grey-200 bg-grey-100",
        false: "",
      },
      invalid: {
        true: "border-red-100 focus-visible:border-red-100",
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

export const positionerClass = cva("z-10 outline-none");

export const popupClass = cva(
  "flex gap-3 rounded-12 border border-grey-200 bg-white p-3 shadow-200 transition-[opacity,scale] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
);

export const dateInputClass = cva(
  "h-11 rounded-12 border border-grey-300 bg-white px-4 py-3 text-16-m500 text-blue-grey-300 outline-none focus-visible:border-grey-400",
);

export const timeColumnClass = cva("flex flex-col gap-2");

export const timeHeaderClass = cva("text-12-m500 text-grey-500");

export const timeListClass = cva("flex max-h-60 flex-col gap-1 overflow-y-auto");

export const timeOptionVariants = cva(
  "flex h-8 shrink-0 cursor-pointer items-center rounded-8 px-3 text-14-m500 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-green-70",
  {
    variants: {
      selected: {
        true: "bg-blue-green-70 text-white",
        false: "text-blue-grey-300 hover:bg-grey-100",
      },
    },
  },
);
