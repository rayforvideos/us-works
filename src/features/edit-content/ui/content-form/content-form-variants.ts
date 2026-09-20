import { cva } from "class-variance-authority";

export const formClass = cva("mx-auto flex w-full max-w-165 flex-col gap-10");

export const sectionClass = cva("flex flex-col gap-4");

export const groupClass = cva("flex flex-col gap-4");

export const headingClass = cva("text-20-sb600 text-blue-grey-300");

export const helperClass = cva("text-12-m500 text-grey-400");

export const dividerClass = cva("border-t-2 border-grey-200");

export const requestErrorClass = cva("min-h-3.5 text-14-sb600 text-red-100");
