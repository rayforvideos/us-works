import { parsePage } from "@/shared/lib/pagination-params";

import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE,
  NOTIFICATION_LIST_PARAM_KEYS,
  SCHEDULED_AT_FORMAT_OPTIONS,
  SEND_STATUS_LABELS,
  SEND_STATUS_TONES,
} from "./constants";
import {
  type NotificationListParams,
  type NotificationStatKey,
  type NotificationStats,
  type ScheduledAtParts,
  type SendStatus,
  type SendStatusBadge,
} from "./types";

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function getSendStatusBadge(status: SendStatus): SendStatusBadge {
  return { label: SEND_STATUS_LABELS[status], tone: SEND_STATUS_TONES[status] };
}

export function formatScheduledAt(iso: string | undefined): ScheduledAtParts | null {
  if (iso === undefined || iso === "") {
    return null;
  }
  const scheduled = new Date(iso);
  if (Number.isNaN(scheduled.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("ko-KR", SCHEDULED_AT_FORMAT_OPTIONS).formatToParts(
    scheduled,
  );

  return {
    date: `${readPart(parts, "year")}.${readPart(parts, "month")}.${readPart(parts, "day")}`,
    time: `${readPart(parts, "hour")}:${readPart(parts, "minute")}`,
  };
}

export function getStatCount(
  stats: NotificationStats | undefined,
  key: NotificationStatKey,
): number | null {
  if (stats === undefined) {
    return null;
  }
  return stats[key];
}

export function parseNotificationListParams(searchParams: URLSearchParams): NotificationListParams {
  return {
    page: parsePage(searchParams.get(NOTIFICATION_LIST_PARAM_KEYS.page), MAX_PAGE),
    limit: DEFAULT_PAGE_LIMIT,
  };
}
