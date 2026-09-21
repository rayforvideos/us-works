import { parsePage } from "@/shared/lib/pagination-params";
import { fromSeoulIso, toSeoulParts } from "@/shared/lib/seoul-time";

import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE,
  NOTIFICATION_LIST_PARAM_KEYS,
  SEND_STATUS_LABELS,
  SEND_STATUS_TONES,
  TARGET_TYPE_LABELS,
} from "./constants";
import {
  type Notification,
  type NotificationChanges,
  type NotificationListParams,
  type NotificationStatKey,
  type NotificationStats,
  type NotificationUpdate,
  type ScheduledAtParts,
  type SendStatus,
  type SendStatusBadge,
  type TargetType,
} from "./types";

export function canEditNotification(notification: Notification): boolean {
  return notification.send_status === "pending";
}

export function diffNotification(
  current: Notification,
  next: NotificationChanges,
): NotificationUpdate {
  const isDetailChanged = current.title !== next.title || current.target_type !== next.targetType;
  const scheduledAt = next.scheduledAt;
  const isScheduleChanged =
    scheduledAt !== undefined && fromSeoulIso(current.scheduled_at) !== fromSeoulIso(scheduledAt);

  return {
    detail: isDetailChanged ? { title: next.title, target_type: next.targetType } : undefined,
    schedule: isScheduleChanged ? { scheduled_at: scheduledAt } : undefined,
  };
}

export function hasNotificationChanges(update: NotificationUpdate): boolean {
  return update.detail !== undefined || update.schedule !== undefined;
}

export function getSendStatusBadge(status: SendStatus): SendStatusBadge {
  return { label: SEND_STATUS_LABELS[status], tone: SEND_STATUS_TONES[status] };
}

export function getTargetTypeLabel(targetType: TargetType): string {
  return TARGET_TYPE_LABELS[targetType];
}

export function formatScheduledAt(iso: string | undefined): ScheduledAtParts | null {
  if (iso === undefined || iso === "") {
    return null;
  }
  const parts = toSeoulParts(new Date(iso));
  if (parts === null) {
    return null;
  }

  return {
    date: `${parts.year}.${parts.month}.${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
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
