import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

import { PublishRow } from "../publish-row";
import { radioGroupClass } from "./option-radio-row-variants";
import { type OptionRadioRowProps } from "./types";

export function OptionRadioRow({
  label,
  name,
  options,
  value,
  onChange,
  disabled,
  disabledValues = [],
}: OptionRadioRowProps) {
  return (
    <PublishRow label={label} align="center">
      <RadioGroup
        name={name}
        aria-label={label}
        className={radioGroupClass()}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={disabledValues.includes(option.value)}
          />
        ))}
      </RadioGroup>
    </PublishRow>
  );
}
