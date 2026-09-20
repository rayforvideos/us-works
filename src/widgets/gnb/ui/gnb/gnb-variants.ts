import { cva } from "class-variance-authority";

export const gnbClass = cva("w-full");

export const containerClass = cva(
  "flex min-h-17.5 items-center border-b border-grey-200 bg-white py-3 xl:px-9",
);

export const rowClass = cva("flex min-h-11 w-full flex-wrap items-center gap-2");

export const backButtonClass = cva(
  "flex min-w-0 cursor-pointer items-center gap-2 text-blue-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70 [&>svg]:size-6 [&>svg]:shrink-0",
);

export const titleClass = cva("flex min-w-0 items-center text-18-b700 text-blue-grey-300");

export const titleTextClass = cva("truncate");

export const actionsClass = cva("ml-auto flex items-center gap-4");

export const messageClass = cva("text-12-m500 text-grey-500");
