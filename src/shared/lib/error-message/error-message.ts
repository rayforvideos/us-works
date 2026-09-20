import { isApiError } from "@/shared/api";

import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES } from "./constants";

export function getErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return DEFAULT_ERROR_MESSAGE;
  }
  return ERROR_MESSAGES[error.kind];
}
