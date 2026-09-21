import { type SendStatus, type SendStatusTone, type TargetType } from "./types";

export const SEND_STATUSES = ["pending", "sent", "failed"] as const;

export const MAX_NOTIFICATION_TITLE_LENGTH = 50;

export const SEND_STATUS_LABELS: Record<SendStatus, string> = {
  sent: "발송",
  pending: "예약",
  failed: "실패",
};

export const TARGET_TYPES = ["all", "follower", "member"] as const;

export const TARGET_TYPE_LABELS: Record<TargetType, string> = {
  all: "전체",
  follower: "팔로워",
  member: "멤버십",
};

export const SEND_STATUS_TONES: Record<SendStatus, SendStatusTone> = {
  sent: "green",
  pending: "yellow",
  failed: "red",
};

export const NOTIFICATION_LIST_PARAM_KEYS = {
  page: "page",
} as const;

export const DEFAULT_PAGE_LIMIT = 10;

export const MAX_PAGE = 9999;
