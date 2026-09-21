import { type Content } from "@/entities/content";
import {
  canEditNotification,
  diffNotification,
  hasNotificationChanges,
  type Notification,
} from "@/entities/notification";
import { fromSeoulIso, toSeoulIso } from "@/shared/lib/seoul-time";

import { type PublishOptionsValues } from "../publish-options-schema";
import { applyUseContentTitle, isNotifying, toPublishVisibility } from "../publish-rules";
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
  if (notification !== null && !canEditNotification(notification)) {
    return [];
  }
  const title = applyUseContentTitle({
    useContentTitle: values.useContentTitle,
    contentTitle,
    fallback: values.notificationTitle,
  });
  const scheduledAt =
    values.visibility === "scheduled" ? toSeoulIso(values.publishedAt) : undefined;

  if (!isNotifying(values)) {
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
  const update = diffNotification(notification, {
    title,
    targetType: values.targetType,
    scheduledAt,
  });
  if (!hasNotificationChanges(update)) {
    return [];
  }
  return [{ kind: "notification-update", id: notification.id, ...update }];
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
