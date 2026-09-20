import { type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Spinner } from "@/shared/ui/spinner";

import {
  buttonVariants,
  labelClass,
  loadingClass,
  resolveButtonVariant,
  spinnerSlotClass,
} from "./button-variants";
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
  loading = false,
  className,
  type = "button",
  onClick,
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
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      className={cn(buttonVariants(variantProps), loading && loadingClass(), className)}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      <span data-slot="content" className={labelClass({ loading })}>
        {leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
        {children}
        {rightIcon ? <IconSlot>{rightIcon}</IconSlot> : null}
      </span>
      {loading ? (
        <span className={spinnerSlotClass()}>
          <Spinner />
        </span>
      ) : null}
    </button>
  );
}
