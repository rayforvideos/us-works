import { type Content } from "@/entities/content/@x/notification";

import { type SEND_STATUSES, type TARGET_TYPES } from "./constants";

export type SendStatus = (typeof SEND_STATUSES)[number];

export type TargetType = (typeof TARGET_TYPES)[number];

export type SendStatusTone = "green" | "yellow" | "red";

type NotificationVisibility = "public" | "private";

export type NotificationStats = {
  success_count: number;
  failure_count: number;
};

export type NotificationStatKey = keyof NotificationStats;

export type Notification = {
  id: number;
  content_id: number;
  content?: Content;
  content_status: NotificationVisibility;
  title: string;
  target_type: TargetType;
  send_status: SendStatus;
  scheduled_at: string;
  sent_at?: string;
  stats?: NotificationStats;
  created_at: string;
  updated_at: string;
};

export type NotificationInput = {
  content_id: number;
  title: string;
  target_type: TargetType;
  scheduled_at?: string;
};

export type NotificationUpdateInput = {
  title?: string;
  target_type?: TargetType;
};

export type NotificationScheduleInput = {
  scheduled_at: string;
};

export type NotificationSchedule = {
  notification_id: number;
  is_scheduled: boolean;
  scheduled_at?: string;
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
