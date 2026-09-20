import { cn } from "@/shared/lib/cn";
import { CheckIcon } from "@/shared/ui/icon";

import { boxVariants, containerVariants, iconClass, inputClass } from "./checkbox-variants";
import { type CheckboxProps, type CheckboxSize } from "./types";

/**
 * @constants
 */
const ICON_SIZE: Record<CheckboxSize, number> = {
  medium: 12,
  large: 15,
};

export function Checkbox({ size = "medium", className, ...rest }: CheckboxProps) {
  return (
    <span className={cn(containerVariants({ size }), className)}>
      <input type="checkbox" data-size={size} className={inputClass()} {...rest} />
      <span className={boxVariants({ size })} />
      <CheckIcon size={ICON_SIZE[size]} className={iconClass()} />
    </span>
  );
}
