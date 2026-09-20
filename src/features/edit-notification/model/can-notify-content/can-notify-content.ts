import { type Content } from "@/entities/content";

export function canNotifyContent(content: Content): boolean {
  return content.publish_status !== "draft";
}
