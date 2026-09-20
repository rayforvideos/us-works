import { type SendStatus, type SendStatusTone } from "./types";

export const SEND_STATUSES = ["pending", "sent", "failed"] as const;

export const SEND_STATUS_LABELS: Record<SendStatus, string> = {
  sent: "발송",
  pending: "예약",
  failed: "실패",
};

export const SEND_STATUS_TONES: Record<SendStatus, SendStatusTone> = {
  sent: "green",
  pending: "yellow",
  failed: "red",
};

export const NOTIFICATION_LIST_PARAM_KEYS = {
  page: "page",
} as const;

export const DEFAULT_PAGE_LIMIT = 10;

export const MAX_PAGE = 9999;

export const SCHEDULED_AT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};
