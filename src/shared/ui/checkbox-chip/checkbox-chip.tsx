import { cn } from "@/shared/lib/cn";
import { Checkbox } from "@/shared/ui/checkbox";

import { chipVariants } from "./checkbox-chip-variants";
import { type CheckboxChipProps } from "./types";

export function CheckboxChip({
  shape = "outlined",
  className,
  children,
  ...rest
}: CheckboxChipProps) {
  return (
    <label className={cn(chipVariants({ shape }), className)}>
      <Checkbox className="size-4.5" data-shape={shape} {...rest} />
      <span>{children}</span>
    </label>
  );
}
