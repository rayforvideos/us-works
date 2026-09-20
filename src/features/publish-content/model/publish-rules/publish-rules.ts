import { type Content } from "@/entities/content";

import { type PublishVisibility } from "../publish-options-schema";

/**
 * @types
 */
type UseContentTitleInput = {
  useContentTitle: boolean;
  contentTitle: string;
  fallback?: string;
};

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
