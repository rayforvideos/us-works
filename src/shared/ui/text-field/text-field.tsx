import { type ChangeEvent, type Ref, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { RoundCancelIcon } from "@/shared/ui/icon";

import {
  clearButtonClass,
  controlClass,
  counterClass,
  errorTextClass,
  fieldClass,
  inputVariants,
  trailingSlotClass,
} from "./text-field-variants";
import { type TextFieldProps } from "./types";

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

export function TextField({
  type = "text",
  clearable = false,
  showCounter = false,
  error,
  onClear,
  className,
  value,
  defaultValue,
  onChange,
  maxLength,
  disabled,
  ref,
  ...rest
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const errorId = useId();
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? "").length);
  const length = value === undefined ? innerLength : String(value).length;
  const isFilled = length > 0;
  const isInvalid = error !== undefined && error !== null && error !== false;
  const trailing = clearable ? "clear" : showCounter ? "counter" : "none";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInnerLength(event.target.value.length);
    onChange?.(event);
  }

  function handleClear() {
    if (value === undefined && inputRef.current) {
      inputRef.current.value = "";
      setInnerLength(0);
    }
    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <div className={cn(fieldClass(), className)}>
      <div className={controlClass()}>
        <input
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          data-filled={isFilled ? "true" : "false"}
          className={inputVariants({ filled: isFilled, invalid: isInvalid, trailing })}
          {...rest}
        />
        {trailing === "clear" ? (
          <span className={trailingSlotClass()}>
            <button
              type="button"
              aria-label="입력 지우기"
              disabled={disabled === true || !isFilled}
              onClick={handleClear}
              className={clearButtonClass()}
            >
              <RoundCancelIcon />
            </button>
          </span>
        ) : null}
        {trailing === "counter" ? (
          <span className={trailingSlotClass()}>
            <span className={counterClass()} data-testid="counter">
              {maxLength === undefined ? length : `${String(length)}/${String(maxLength)}`}
            </span>
          </span>
        ) : null}
      </div>
      <p id={errorId} data-testid="error-text" className={errorTextClass()}>
        {isInvalid ? error : null}
      </p>
    </div>
  );
}
