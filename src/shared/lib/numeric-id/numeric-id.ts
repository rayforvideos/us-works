/**
 * @constants
 */
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

export function parseNumericId(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined || !POSITIVE_INTEGER_PATTERN.test(raw)) {
    return null;
  }
  return Number(raw);
}
