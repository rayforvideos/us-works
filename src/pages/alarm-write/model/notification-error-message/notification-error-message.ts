import { isApiError } from "@/shared/api";
import { getErrorMessage } from "@/shared/lib/error-message";

import { DUPLICATE_NOTIFICATION_MESSAGE } from "./constants";

export function getNotificationErrorMessage(error: unknown): string {
  if (isApiError(error) && error.kind === "conflict") {
    return DUPLICATE_NOTIFICATION_MESSAGE;
  }
  return getErrorMessage(error);
}
