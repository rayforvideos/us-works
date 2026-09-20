import { type Content } from "./types";

/**
 * @constants
 */
export const PUBLISHED_CONTENT_FIXTURE: Content = {
  id: 1,
  user_id: 7,
  title: "첫 번째 콘텐츠",
  categories: ["realty"],
  body: "본문",
  status: "public",
  publish_status: "published",
  published_at: "2026-09-20T10:30:00+09:00",
  created_at: "2026-09-19T10:30:00+09:00",
  updated_at: "2026-09-19T10:30:00+09:00",
  stats: { view_count: 12, like_count: 3, comment_count: 1 },
  notification_status: { has_notification: false },
};

export const SCHEDULED_CONTENT_FIXTURE: Content = {
  id: 2,
  user_id: 7,
  title: "두 번째 콘텐츠",
  categories: ["investment", "macroEconomics"],
  body: "본문",
  status: "public",
  publish_status: "scheduled",
  published_at: "2026-10-01T09:00:00+09:00",
  created_at: "2026-09-18T10:30:00+09:00",
  updated_at: "2026-09-18T10:30:00+09:00",
  stats: { view_count: 0, like_count: 0, comment_count: 0 },
  notification_status: { has_notification: true, send_status: "pending" },
};

export const DRAFT_CONTENT_FIXTURE: Content = {
  id: 3,
  user_id: 7,
  title: "세 번째 콘텐츠",
  categories: ["safeAsset"],
  body: "본문",
  status: "private",
  publish_status: "draft",
  created_at: "2026-09-17T10:30:00+09:00",
  updated_at: "2026-09-17T10:30:00+09:00",
  stats: { view_count: 0, like_count: 0, comment_count: 0 },
  notification_status: { has_notification: false },
};

export const CONTENT_FIXTURE: readonly Content[] = [
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
  DRAFT_CONTENT_FIXTURE,
];
