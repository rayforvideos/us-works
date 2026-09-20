import { cva } from "class-variance-authority";

export const formClass = cva("mx-auto flex w-full max-w-165 flex-col gap-10");

export const sectionClass = cva("flex flex-col gap-4");

export const labelRowClass = cva("flex min-h-5 items-center gap-2");

export const labelClass = cva("text-20-sb600 text-blue-grey-300");

export const fieldErrorClass = cva("text-12-m500 text-red-100");

export const radioGroupClass = cva("flex-row gap-10");

export const requestErrorClass = cva("min-h-3.5 text-14-sb600 text-red-100");
