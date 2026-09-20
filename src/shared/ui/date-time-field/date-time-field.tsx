import { type ChangeEvent, type MouseEvent } from "react";

import { cn } from "@/shared/lib/cn";

import { boxVariants, overlayInputClass, valueVariants } from "./date-time-field-variants";
import { formatDateTimeLabel } from "./format-date-time-label";
import { snapToStep } from "./snap-to-step";
import { type DateTimeFieldProps } from "./types";

/**
 * @constants
 */
const HALF_HOUR_STEP = 1800;

export function DateTimeField({
  value,
  onChange,
  placeholder,
  invalid = false,
  disabled = false,
  min,
  step = HALF_HOUR_STEP,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  className,
}: DateTimeFieldProps) {
  const label = formatDateTimeLabel(value);
  const isFilled = label !== "";

  function changeValue(event: ChangeEvent<HTMLInputElement>) {
    onChange(snapToStep(event.target.value, step));
  }

  function openPicker(event: MouseEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  return (
    <div className={cn(boxVariants({ disabled, invalid }), className)}>
      <span aria-hidden="true" className={valueVariants({ filled: isFilled })}>
        {isFilled ? label : placeholder}
      </span>
      <input
        type="datetime-local"
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={invalid || undefined}
        value={value}
        min={min}
        step={step}
        disabled={disabled}
        onChange={changeValue}
        onClick={openPicker}
        className={overlayInputClass()}
      />
    </div>
  );
}
