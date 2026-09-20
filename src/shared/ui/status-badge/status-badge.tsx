import { cn } from "@/shared/lib/cn";

import { badgeVariants, dotSlotClass, dotVariants } from "./status-badge-variants";
import { type StatusBadgeProps } from "./types";

export function StatusBadge({
  tone,
  showDot = true,
  className,
  children,
  ...rest
}: StatusBadgeProps) {
  return (
    <span
      data-tone={tone}
      data-dot={showDot ? "true" : "false"}
      className={cn(badgeVariants({ tone }), className)}
      {...rest}
    >
      {showDot ? (
        <span aria-hidden className={dotSlotClass()}>
          <span className={dotVariants({ tone })} />
        </span>
      ) : null}
      {children}
    </span>
  );
}
