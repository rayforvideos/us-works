import { cn } from "@/shared/lib/cn";
import { hasFieldError } from "@/shared/lib/field-error";

import { fieldErrorClass } from "./field-error-variants";
import { type FieldErrorProps } from "./types";

export function FieldError({ error, id, reserve = true, className }: FieldErrorProps) {
  const hasError = hasFieldError(error);
  if (!hasError && !reserve) {
    return null;
  }

  return (
    <p id={id} data-testid="error-text" className={cn(fieldErrorClass({ reserve }), className)}>
      {hasError ? error : null}
    </p>
  );
}
