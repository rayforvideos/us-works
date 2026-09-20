import { isApiError } from "@/shared/api";
import { getErrorMessage } from "@/shared/lib/error-message";

import { DUPLICATE_EMAIL_MESSAGE, INVALID_CREDENTIALS_MESSAGE } from "./constants";
import { type AuthIntent } from "./types";

export function getAuthErrorMessage(error: unknown, intent: AuthIntent): string {
  if (isApiError(error)) {
    if (intent === "login" && error.kind === "unauthorized") {
      return INVALID_CREDENTIALS_MESSAGE;
    }
    if (intent === "register" && error.kind === "conflict") {
      return DUPLICATE_EMAIL_MESSAGE;
    }
  }
  return getErrorMessage(error);
}
