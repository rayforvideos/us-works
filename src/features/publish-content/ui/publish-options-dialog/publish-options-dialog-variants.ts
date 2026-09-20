import { cva } from "class-variance-authority";

export const headerClass = cva("py-4");

export const bodyClass = cva("px-6 py-8");

export const formClass = cva("flex flex-col gap-2");

export const sectionsClass = cva("flex flex-col gap-8");

export const footerContentClass = cva("flex w-full items-center justify-between gap-4");

export const requestErrorClass = cva("min-w-0 flex-1 truncate text-12-m500 text-red-100");

export const footerActionsClass = cva("flex shrink-0 gap-2");
