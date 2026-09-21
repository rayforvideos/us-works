import { type Content } from "@/entities/content";
import { type Notification } from "@/entities/notification";
import { fromSeoulIso, toSeoulIso } from "@/shared/lib/seoul-time";

import { type PublishOptionsValues } from "../publish-options-schema";
import { applyUseContentTitle, toPublishVisibility } from "../publish-rules";
import { type BuildPublishPlanInput, type PublishStep } from "./types";

/**
 * @types
 */
type NotificationStepInput = {
  notification: Notification | null;
  values: PublishOptionsValues;
  contentTitle: string;
};

function buildVisibilitySteps(
  content: Content | null,
  values: PublishOptionsValues,
): PublishStep[] {
  const current = content === null ? "private" : toPublishVisibility(content);

  switch (values.visibility) {
    case "public":
      return current === "public" ? [] : [{ kind: "status", status: "public" }];
    case "private":
      if (current === "private") {
        return [];
      }
      if (current === "scheduled") {
        return [{ kind: "schedule-delete" }, { kind: "status", status: "private" }];
      }
      return [{ kind: "status", status: "private" }];
    case "scheduled": {
      const publishedAt = toSeoulIso(values.publishedAt);
      if (current !== "scheduled") {
        return [{ kind: "schedule-create", publishedAt }];
      }
      if (fromSeoulIso(content?.published_at ?? "") === values.publishedAt) {
        return [];
      }
      return [{ kind: "schedule-update", publishedAt }];
    }
  }
}

function buildNotificationSteps({
  notification,
  values,
  contentTitle,
}: NotificationStepInput): PublishStep[] {
  if (notification?.send_status === "sent") {
    return [];
  }
  const title = applyUseContentTitle({
    useContentTitle: values.useContentTitle,
    contentTitle,
    fallback: values.notificationTitle,
  });
  const scheduledAt =
    values.visibility === "scheduled" ? toSeoulIso(values.publishedAt) : undefined;

  if (!values.notify || values.visibility === "private") {
    return notification === null ? [] : [{ kind: "notification-delete", id: notification.id }];
  }
  if (notification === null) {
    return [
      {
        kind: "notification-create",
        input: { title, target_type: values.targetType, scheduled_at: scheduledAt },
      },
    ];
  }
  const isDetailChanged =
    notification.title !== title || notification.target_type !== values.targetType;
  const isScheduleChanged = scheduledAt !== undefined && notification.scheduled_at !== scheduledAt;
  if (!isDetailChanged && !isScheduleChanged) {
    return [];
  }
  return [
    {
      kind: "notification-update",
      id: notification.id,
      detail: isDetailChanged ? { title, target_type: values.targetType } : undefined,
      schedule: isScheduleChanged ? { scheduled_at: scheduledAt } : undefined,
    },
  ];
}

export function buildPublishPlan({
  current,
  values,
  contentTitle,
}: BuildPublishPlanInput): PublishStep[] {
  return [
    ...buildVisibilitySteps(current.content, values),
    ...buildNotificationSteps({ notification: current.notification, values, contentTitle }),
  ];
}
