import { cn } from "@/shared/lib/cn";

import { RadioGroupProvider, useRadioGroupContext } from "./radio-group-context";
import {
  circleClass,
  controlClass,
  dotClass,
  groupClass,
  inputClass,
  itemClass,
  labelClass,
  subLabelClass,
  textsClass,
} from "./radio-group-variants";
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
      <div role="radiogroup" className={cn(groupClass(), className)} {...rest}>
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
      <span className={controlClass()}>
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
      <span className={textsClass()}>
        <span className={labelClass()}>{label}</span>
        {subLabel ? <span className={subLabelClass()}>{subLabel}</span> : null}
      </span>
    </label>
  );
}
