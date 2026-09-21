import { parsePage } from "@/shared/lib/pagination-params";
import { toSeoulParts } from "@/shared/lib/seoul-time";

import {
  CATEGORY_LABELS,
  CONTENT_CATEGORIES,
  CONTENT_LIST_PARAM_KEYS,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE,
  PUBLISH_STATUS_LABELS,
  PUBLISH_STATUS_TONES,
  PUBLISH_STATUSES,
} from "./constants";
import {
  type Content,
  type ContentCategory,
  type ContentListFilters,
  type ContentListParams,
  type PublishedAtParts,
  type PublishStatus,
  type PublishStatusBadge,
} from "./types";

function isContentCategory(value: string): value is ContentCategory {
  return CONTENT_CATEGORIES.some((category) => category === value);
}

function isPublishStatus(value: string): value is PublishStatus {
  return PUBLISH_STATUSES.some((status) => status === value);
}

function writeParam(params: URLSearchParams, key: string, value: string | undefined): void {
  if (value === undefined) {
    params.delete(key);
    return;
  }
  params.set(key, value);
}

function parseCategory(value: string | null): ContentCategory | undefined {
  if (value === null || !isContentCategory(value)) {
    return undefined;
  }
  return value;
}

function parsePublishStatus(value: string | null): PublishStatus | undefined {
  if (value === null || !isPublishStatus(value)) {
    return undefined;
  }
  return value;
}

export function canNotifyContent(content: Content): boolean {
  return content.publish_status !== "draft";
}

export function hasNotification(content: Content): boolean {
  return content.notification_status?.has_notification === true;
}

export function getCategoryLabel(value: string): string {
  if (!isContentCategory(value)) {
    return value;
  }
  return CATEGORY_LABELS[value];
}

export function getPublishStatusBadge(status: PublishStatus): PublishStatusBadge {
  return { label: PUBLISH_STATUS_LABELS[status], tone: PUBLISH_STATUS_TONES[status] };
}

export function formatPublishedAt(iso: string | undefined): PublishedAtParts | null {
  if (iso === undefined || iso === "") {
    return null;
  }
  const parts = toSeoulParts(new Date(iso));
  if (parts === null) {
    return null;
  }

  return {
    date: `${parts.year.slice(-2)}.${parts.month}.${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

export function withContentListFilters(
  searchParams: URLSearchParams,
  filters: ContentListFilters,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  writeParam(next, CONTENT_LIST_PARAM_KEYS.category, filters.category);
  writeParam(next, CONTENT_LIST_PARAM_KEYS.publishStatus, filters.publishStatus);
  next.delete(CONTENT_LIST_PARAM_KEYS.page);

  return next;
}

export function parseContentListParams(searchParams: URLSearchParams): ContentListParams {
  return {
    page: parsePage(searchParams.get(CONTENT_LIST_PARAM_KEYS.page), MAX_PAGE),
    limit: DEFAULT_PAGE_LIMIT,
    category: parseCategory(searchParams.get(CONTENT_LIST_PARAM_KEYS.category)),
    publishStatus: parsePublishStatus(searchParams.get(CONTENT_LIST_PARAM_KEYS.publishStatus)),
  };
}
