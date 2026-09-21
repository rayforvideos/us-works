import { parseNumericId } from "@/shared/lib/numeric-id";

import { CONTENT_ID_PARAM } from "./constants";

export function parseContentId(searchParams: URLSearchParams): number | null {
  return parseNumericId(searchParams.get(CONTENT_ID_PARAM));
}
