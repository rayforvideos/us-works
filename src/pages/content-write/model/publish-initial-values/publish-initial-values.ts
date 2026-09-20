import { type Content } from "@/entities/content";
import { type Notification } from "@/entities/notification";
import { fromSeoulIso } from "@/shared/lib/seoul-time";

import { type PublishOptionsValues } from "../publish-options-schema";
import { toPublishVisibility } from "../publish-rules";

/**
 * @types
 */
type PublishInitialInput = {
  content: Content | null;
  notification: Notification | null;
};

/**
 * @constants
 */
const DEFAULT_VALUES: PublishOptionsValues = {
  visibility: "public",
  publishedAt: "",
  notify: true,
  targetType: "all",
  useContentTitle: false,
  notificationTitle: "",
};

export function toPublishOptionsValues({
  content,
  notification,
}: PublishInitialInput): PublishOptionsValues {
  if (content === null) {
    return DEFAULT_VALUES;
  }
  const visibility = toPublishVisibility(content);

  return {
    visibility,
    publishedAt: visibility === "scheduled" ? fromSeoulIso(content.published_at ?? "") : "",
    notify: notification !== null,
    targetType: notification?.target_type ?? DEFAULT_VALUES.targetType,
    useContentTitle: false,
    notificationTitle: notification?.title ?? "",
  };
}
