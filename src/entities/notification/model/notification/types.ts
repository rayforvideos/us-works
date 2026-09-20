import { type Content } from "@/entities/content/@x/notification";

import { type SEND_STATUSES } from "./constants";

export type SendStatus = (typeof SEND_STATUSES)[number];

type TargetType = "all" | "follower" | "member";

export type SendStatusTone = "green" | "yellow" | "red";

type ContentVisibility = "public" | "private";

export type NotificationStats = {
  success_count: number;
  failure_count: number;
};

export type NotificationStatKey = keyof NotificationStats;

export type Notification = {
  id: number;
  content_id: number;
  content: Content;
  content_status: ContentVisibility;
  title: string;
  target_type: TargetType;
  send_status: SendStatus;
  scheduled_at: string;
  sent_at?: string;
  stats?: NotificationStats;
  created_at: string;
  updated_at: string;
};

export type NotificationListResponse = {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
};

export type NotificationListParams = {
  page: number;
  limit: number;
};

export type SendStatusBadge = {
  label: string;
  tone: SendStatusTone;
};

export type ScheduledAtParts = {
  date: string;
  time: string;
};
