import { cva } from "class-variance-authority";

export const containerVariants = cva("relative inline-flex shrink-0 items-center justify-center", {
  variants: { size: { medium: "size-5", large: "size-6" } },
});

export const inputClass = cva(
  "peer absolute inset-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed",
);

export const boxVariants = cva(
  "rounded-4 border border-grey-300 bg-white transition-colors peer-checked:border-transparent peer-checked:bg-blue-green-80 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-green-70 peer-disabled:border-grey-200 peer-disabled:bg-grey-200",
  { variants: { size: { medium: "size-4", large: "size-5" } } },
);

export const iconClass = cva(
  "pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 peer-disabled:text-grey-300",
);
