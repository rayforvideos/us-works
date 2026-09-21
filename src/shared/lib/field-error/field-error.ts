import { type ReactNode } from "react";

export function readFieldError(errors: readonly unknown[]): string | undefined {
  const [first] = errors;
  if (typeof first !== "object" || first === null || !("message" in first)) {
    return undefined;
  }
  return typeof first.message === "string" ? first.message : undefined;
}

export function hasFieldError(error: ReactNode): boolean {
  return error !== undefined && error !== null && error !== false;
}
