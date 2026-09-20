import { Select as BaseSelect } from "@base-ui/react/select";

import { cn } from "@/shared/lib/cn";
import { RoundArrowIcon } from "@/shared/ui/icon";

import {
  iconClass,
  itemClass,
  popupClass,
  positionerClass,
  triggerClass,
  valueClass,
} from "./select-variants";
import { type SelectProps } from "./types";

export function Select({
  items,
  placeholder,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
  ...rootProps
}: SelectProps) {
  return (
    <BaseSelect.Root items={items} {...rootProps}>
      <BaseSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(triggerClass(), className)}
      >
        <BaseSelect.Value placeholder={placeholder} className={valueClass()} />
        <BaseSelect.Icon className={iconClass()}>
          <RoundArrowIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={8}
          alignItemWithTrigger={false}
          className={positionerClass()}
        >
          <BaseSelect.Popup className={popupClass()}>
            {items.map((item) => (
              <BaseSelect.Item
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                className={itemClass()}
              >
                <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
