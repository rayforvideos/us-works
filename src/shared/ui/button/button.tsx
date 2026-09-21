import { type MouseEvent, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Spinner } from "@/shared/ui/spinner";

import {
  buttonVariants,
  fullWidthClass,
  labelClass,
  loadingClass,
  resolveButtonVariant,
  spinnerSlotClass,
  toButtonVariantProps,
} from "./button-variants";
import { type ButtonProps } from "./types";

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

export function Button(props: ButtonProps) {
  const {
    variant,
    importance,
    size,
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    className,
    type = "button",
    onClick,
    children,
    ...rest
  } = props;
  const variantProps = toButtonVariantProps(props);
  const resolved = resolveButtonVariant(variantProps);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      data-variant={resolved.variant}
      data-importance={resolved.importance}
      data-size={resolved.size ?? undefined}
      data-loading={loading ? "true" : undefined}
      data-full-width={fullWidth ? "true" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(
        buttonVariants(variantProps),
        fullWidth && fullWidthClass(),
        loading && loadingClass(),
        className,
      )}
      onClick={handleClick}
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
