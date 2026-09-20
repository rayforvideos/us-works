import { CONTENT_ID_PARAM } from "./constants";

/**
 * @constants
 */
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

export function parseContentId(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get(CONTENT_ID_PARAM);
  if (raw === null || !POSITIVE_INTEGER_PATTERN.test(raw)) {
    return null;
  }
  return Number(raw);
}
