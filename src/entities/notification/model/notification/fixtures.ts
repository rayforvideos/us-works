import { type Notification } from "./types";

/**
 * @constants
 */
export const SENT_NOTIFICATION_FIXTURE: Notification = {
  id: 1,
  content_id: 1,
  content_status: "public",
  title: "첫 번째 알림",
  target_type: "all",
  send_status: "sent",
  scheduled_at: "2026-09-20T10:30:00+09:00",
  sent_at: "2026-09-20T10:30:05+09:00",
  stats: { success_count: 120, failure_count: 3 },
  created_at: "2026-09-19T10:30:00+09:00",
  updated_at: "2026-09-20T10:30:05+09:00",
};

export const PENDING_NOTIFICATION_FIXTURE: Notification = {
  id: 2,
  content_id: 2,
  content_status: "public",
  title: "두 번째 알림",
  target_type: "follower",
  send_status: "pending",
  scheduled_at: "2026-10-01T09:00:00+09:00",
  created_at: "2026-09-18T10:30:00+09:00",
  updated_at: "2026-09-18T10:30:00+09:00",
};

export const FAILED_NOTIFICATION_FIXTURE: Notification = {
  id: 3,
  content_id: 3,
  content_status: "private",
  title: "세 번째 알림",
  target_type: "member",
  send_status: "failed",
  scheduled_at: "2026-09-17T08:05:00+09:00",
  sent_at: "2026-09-17T08:05:02+09:00",
  stats: { success_count: 0, failure_count: 12 },
  created_at: "2026-09-16T10:30:00+09:00",
  updated_at: "2026-09-17T08:05:02+09:00",
};

export const NOTIFICATION_FIXTURE: readonly Notification[] = [
  SENT_NOTIFICATION_FIXTURE,
  PENDING_NOTIFICATION_FIXTURE,
  FAILED_NOTIFICATION_FIXTURE,
];
