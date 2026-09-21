import {
  type Notification,
  type NotificationChanges,
  type NotificationInput,
} from "@/entities/notification";
import { fromSeoulIso, toSeoulIso } from "@/shared/lib/seoul-time";

import { type NotificationFormValues } from "../notification-input-schema";

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

export function toNotificationChanges(values: NotificationFormValues): NotificationChanges {
  return {
    title: values.title,
    targetType: values.targetType,
    scheduledAt: toSeoulIso(values.scheduledAt),
  };
}
