import { cva } from "class-variance-authority";

export const closeRowClass = cva("flex justify-end px-6 pt-6");

export const bodyClass = cva("flex flex-col gap-4 px-6 py-2");

export const titleClass = cva("text-center text-20-sb600 text-blue-grey-300");

export const descriptionClass = cva("text-center text-14-r400 text-grey-400");

export const actionsClass = cva("grid grid-cols-2 gap-6 px-6 pt-8 pb-6");
