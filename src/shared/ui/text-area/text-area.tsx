import { type ChangeEvent, useId, useState } from "react";

import { cn } from "@/shared/lib/cn";

import {
  boxVariants,
  counterClass,
  errorTextClass,
  fieldClass,
  textareaClass,
} from "./text-area-variants";
import { type TextAreaProps } from "./types";

export function TextArea({
  showCounter = false,
  error,
  className,
  value,
  defaultValue,
  onChange,
  maxLength,
  ...rest
}: TextAreaProps) {
  const errorId = useId();
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? "").length);
  const length = value === undefined ? innerLength : String(value).length;
  const isInvalid = error !== undefined && error !== null && error !== false;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInnerLength(event.target.value.length);
    onChange?.(event);
  }

  return (
    <div className={cn(fieldClass(), className)}>
      <div className={boxVariants({ invalid: isInvalid })}>
        <textarea
          rows={1}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          className={textareaClass()}
          {...rest}
        />
        {showCounter ? (
          <span className={counterClass()} data-testid="counter">
            {maxLength === undefined ? length : `${length}/${maxLength}`}
          </span>
        ) : null}
      </div>
      <p id={errorId} data-testid="error-text" className={errorTextClass()}>
        {isInvalid ? error : null}
      </p>
    </div>
  );
}
