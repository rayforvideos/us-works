export function readFieldError(errors: readonly unknown[]): string | undefined {
  const [first] = errors;
  if (typeof first !== "object" || first === null || !("message" in first)) {
    return undefined;
  }
  return typeof first.message === "string" ? first.message : undefined;
}
