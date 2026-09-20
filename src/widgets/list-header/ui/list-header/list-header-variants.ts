import { cva } from "class-variance-authority";

export const containerClass = cva(
  "flex h-17.5 items-center gap-6 border-b border-grey-200 bg-white",
);

export const logoButtonClass = cva(
  "flex w-30 shrink-0 cursor-pointer items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70",
);

export const tabListClass = cva("flex items-center gap-4");

export const tabActiveClass = cva(
  "rounded-10 aria-[current=page]:bg-grey-100 aria-[current=page]:text-16-ex800 aria-[current=page]:text-blue-grey-300",
);

export const actionsClass = cva("ml-auto flex items-center gap-2");
