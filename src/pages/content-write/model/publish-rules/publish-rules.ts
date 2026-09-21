import { type Content } from "@/entities/content";

import { type PublishVisibility } from "../publish-options-schema";

/**
 * @types
 */
type NotifyRuleInput = {
  visibility: PublishVisibility;
  notify: boolean;
};

type UseContentTitleInput = {
  useContentTitle: boolean;
  contentTitle: string;
  fallback?: string;
};

export function isNotifying(values: NotifyRuleInput): boolean {
  return values.notify && values.visibility !== "private";
}

export function canSchedule(content: Content | null): boolean {
  return (
    content === null || content.publish_status === "scheduled" || content.published_at === undefined
  );
}

export function toPublishVisibility(content: Content): PublishVisibility {
  if (content.publish_status === "scheduled") {
    return "scheduled";
  }
  return content.status === "public" ? "public" : "private";
}

export function applyUseContentTitle({
  useContentTitle,
  contentTitle,
  fallback = "",
}: UseContentTitleInput): string {
  return useContentTitle ? contentTitle : fallback;
}
