import { type Notification, type NotificationInput } from "@/entities/notification";
import { fromSeoulIso, toSeoulIso } from "@/shared/lib/seoul-time";

import { type NotificationFormValues } from "../notification-input-schema";
import { type NotificationUpdate } from "./types";

export function toNotificationInput(
  values: NotificationFormValues,
  contentId: number,
): NotificationInput {
  return {
    content_id: contentId,
    title: values.title,
    target_type: values.targetType,
    scheduled_at: toSeoulIso(values.scheduledAt),
  };
}

export function toNotificationFormValues(notification: Notification): NotificationFormValues {
  return {
    targetType: notification.target_type,
    title: notification.title,
    scheduledAt: fromSeoulIso(notification.scheduled_at),
  };
}

export function isSameNotificationValues(
  initial: NotificationFormValues,
  current: NotificationFormValues,
): boolean {
  return (
    initial.targetType === current.targetType &&
    initial.title === current.title &&
    initial.scheduledAt === current.scheduledAt
  );
}

export function diffNotificationUpdate(
  initial: NotificationFormValues,
  current: NotificationFormValues,
): NotificationUpdate {
  const isDetailChanged =
    initial.title !== current.title || initial.targetType !== current.targetType;
  const isScheduleChanged = initial.scheduledAt !== current.scheduledAt;

  return {
    detail: isDetailChanged ? { title: current.title, target_type: current.targetType } : undefined,
    schedule: isScheduleChanged ? { scheduled_at: toSeoulIso(current.scheduledAt) } : undefined,
  };
}
