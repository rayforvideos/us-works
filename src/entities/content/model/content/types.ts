import { type CONTENT_CATEGORIES, type PUBLISH_STATUSES } from "./constants";

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export type PublishStatusTone = "green" | "yellow" | "grey";

export type ContentVisibility = "public" | "private";

type NotificationSendStatus = "pending" | "sent" | "failed";

type ContentStats = {
  view_count: number;
  like_count: number;
  comment_count: number;
};

type ContentNotificationStatus = {
  has_notification: boolean;
  send_status?: NotificationSendStatus;
};

export type Content = {
  id: number;
  user_id: number;
  title: string;
  categories: ContentCategory[];
  body: string;
  link_url?: string;
  status: ContentVisibility;
  publish_status: PublishStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
  stats: ContentStats;
  notification_status?: ContentNotificationStatus;
};

export type ContentInput = {
  title: string;
  body: string;
  categories: ContentCategory[];
  link_url?: string;
};

export type ContentScheduleInput = {
  published_at: string;
};

export type ContentSchedule = {
  content_id: number;
  is_scheduled: boolean;
  published_at?: string;
};

export type ContentListResponse = {
  contents: Content[];
  total: number;
  page: number;
  limit: number;
};

export type ContentListFilters = {
  category?: ContentCategory;
  publishStatus?: PublishStatus;
};

export type ContentListParams = ContentListFilters & {
  page: number;
  limit: number;
};

export type PublishStatusBadge = {
  label: string;
  tone: PublishStatusTone;
};

export type PublishedAtParts = {
  date: string;
  time: string;
};
