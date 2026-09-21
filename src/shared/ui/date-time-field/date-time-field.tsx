import { type ChangeEvent, type MouseEvent } from "react";

import { cn } from "@/shared/lib/cn";

import { boxVariants, overlayInputClass, valueVariants } from "./date-time-field-variants";
import { formatDateTimeLabel } from "./format-date-time-label";
import { type DateTimeFieldProps } from "./types";

/**
 * @constants
 */
const STEP_SECONDS = 60;

export function DateTimeField({
  value,
  onValueChange,
  placeholder,
  invalid = false,
  disabled = false,
  min,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  className,
}: DateTimeFieldProps) {
  const label = formatDateTimeLabel(value);
  const isFilled = label !== "";

  function changeValue(event: ChangeEvent<HTMLInputElement>) {
    onValueChange(event.target.value);
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
        step={STEP_SECONDS}
        disabled={disabled}
        onChange={changeValue}
        onClick={openPicker}
        className={overlayInputClass()}
      />
    </div>
  );
}
