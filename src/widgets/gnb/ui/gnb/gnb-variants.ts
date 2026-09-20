import { cva } from "class-variance-authority";

export const gnbClass = cva("w-full");

export const containerClass = cva(
  "mx-auto flex h-17.5 w-full max-w-320 items-center border-b border-grey-200 bg-white px-9",
);

export const rowClass = cva("flex h-11 w-full items-center gap-2");

export const backButtonClass = cva(
  "flex size-6 shrink-0 cursor-pointer items-center justify-center text-blue-grey-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70",
);

export const titleClass = cva("text-18-b700 text-blue-grey-300");

export const actionsClass = cva("ml-auto flex items-center gap-2");

export const messageClass = cva("text-12-m500 text-grey-500");
