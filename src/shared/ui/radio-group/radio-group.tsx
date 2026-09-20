import { cn } from "@/shared/lib/cn";

import { RadioGroupProvider, useRadioGroupContext } from "./radio-group-context";
import { circleClass, dotClass, inputClass, itemClass } from "./radio-group-variants";
import { type RadioGroupItemProps, type RadioGroupProps } from "./types";

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <RadioGroupProvider value={{ name, value, defaultValue, disabled, onValueChange }}>
      <div role="radiogroup" className={cn("flex flex-col", className)} {...rest}>
        {children}
      </div>
    </RadioGroupProvider>
  );
}

export function RadioGroupItem({
  value,
  label,
  subLabel,
  disabled = false,
  className,
}: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const isDisabled = group.disabled || disabled;
  const checkedProps =
    group.value === undefined
      ? { defaultChecked: group.defaultValue === value }
      : { checked: group.value === value };

  return (
    <label className={cn(itemClass(), className)}>
      <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
        <input
          type="radio"
          data-lines={subLabel ? "2" : "1"}
          name={group.name}
          value={value}
          disabled={isDisabled}
          onChange={() => group.onValueChange?.(value)}
          className={inputClass()}
          {...checkedProps}
        />
        <span className={circleClass()} />
        <span className={dotClass()} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-14-sb600 text-blue-grey-300">{label}</span>
        {subLabel ? <span className="text-12-m500 text-grey-300">{subLabel}</span> : null}
      </span>
    </label>
  );
}
