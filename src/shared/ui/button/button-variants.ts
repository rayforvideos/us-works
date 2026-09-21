import { cva } from "class-variance-authority";

import { type ButtonProps, type ButtonVariantProps } from "./types";

/**
 * @types
 */
type ResolvedButtonVariant = {
  variant: "solid" | "outline" | "text";
  importance: "primary" | "secondary" | "assistive";
  size: "large" | "medium" | "small" | null;
};

const buttonVariantClasses = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-green-70 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid: "",
        outline: "border bg-white",
        text: "h-10 rounded-10 px-4 py-2.5 text-16-sb600 text-grey-400 hover:text-16-ex800 hover:text-grey-500 focus-visible:bg-grey-100 focus-visible:text-16-ex800 focus-visible:text-blue-grey-300 active:bg-grey-200 active:text-16-ex800 active:text-blue-grey-300",
      },
      importance: {
        primary: "",
        secondary: "",
        assistive: "",
      },
      size: {
        large: "h-12 rounded-14 px-5 py-3 text-18-sb600",
        medium: "h-11 rounded-12 px-4.5 py-3 text-16-sb600",
        small: "h-7.5 rounded-4 px-2.5 py-2 text-12-b700",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        importance: "primary",
        class:
          "bg-blue-green-70 text-white hover:bg-blue-green-80 active:bg-blue-green-90 disabled:bg-grey-200 disabled:text-grey-300",
      },
      {
        variant: "solid",
        importance: "secondary",
        class:
          "bg-blue-green-10 text-blue-green-90 hover:text-blue-green-100 disabled:bg-grey-200 disabled:text-grey-300",
      },
      {
        variant: "solid",
        importance: "assistive",
        class:
          "bg-grey-100 text-blue-grey-300 hover:bg-grey-200 active:bg-grey-300 disabled:bg-grey-200 disabled:text-grey-300",
      },
      {
        variant: "outline",
        importance: "primary",
        class:
          "border-blue-green-70 text-blue-green-70 hover:border-blue-green-80 hover:text-blue-green-80 disabled:border-grey-200 disabled:text-grey-200",
      },
      {
        variant: "outline",
        importance: "secondary",
        class:
          "border-grey-500 text-blue-green-90 hover:text-blue-green-100 disabled:border-grey-200 disabled:text-grey-200",
      },
      {
        variant: "outline",
        importance: "assistive",
        class:
          "border-grey-500 text-grey-500 hover:text-blue-grey-300 disabled:border-grey-200 disabled:text-grey-200",
      },
    ],
  },
);

export function resolveButtonVariant({
  variant = "solid",
  importance,
  size,
}: ButtonVariantProps): ResolvedButtonVariant {
  if (variant === "text") {
    return { variant, importance: "assistive", size: null };
  }
  return { variant, importance: importance ?? "primary", size: size ?? "large" };
}

export function buttonVariants(props: ButtonVariantProps = {}): string {
  return buttonVariantClasses(resolveButtonVariant(props));
}

export function toButtonVariantProps(props: ButtonProps): ButtonVariantProps {
  switch (props.variant) {
    case "outline":
      return { variant: "outline", importance: props.importance, size: props.size };
    case "text":
      return { variant: "text", importance: props.importance };
    case "solid":
    case undefined:
      return { variant: "solid", importance: props.importance, size: props.size };
  }
}

export const labelClass = cva("inline-flex items-center gap-1", {
  variants: {
    loading: {
      true: "invisible",
      false: "",
    },
  },
  defaultVariants: { loading: false },
});

export const loadingClass = cva("pointer-events-none relative");

export const fullWidthClass = cva("w-full");

export const spinnerSlotClass = cva("absolute inset-0 flex items-center justify-center");
