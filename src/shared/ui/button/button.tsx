import { type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { buttonVariants, resolveButtonVariant } from "./button-variants";
import { type ButtonProps, type ButtonVariantProps } from "./types";

function IconSlot({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
    >
      {children}
    </span>
  );
}

export function Button({
  variant,
  importance,
  size,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const variantProps = { variant, importance, size } as ButtonVariantProps;
  const resolved = resolveButtonVariant(variantProps);

  return (
    <button
      type={type}
      data-variant={resolved.variant}
      data-importance={resolved.importance}
      data-size={resolved.size ?? undefined}
      className={cn(buttonVariants(variantProps), className)}
      {...rest}
    >
      {leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
      {children}
      {rightIcon ? <IconSlot>{rightIcon}</IconSlot> : null}
    </button>
  );
}
