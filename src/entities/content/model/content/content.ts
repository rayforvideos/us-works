import { parsePage } from "@/shared/lib/pagination-params";

import {
  CATEGORY_LABELS,
  CONTENT_CATEGORIES,
  CONTENT_LIST_PARAM_KEYS,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE,
  PUBLISH_STATUS_LABELS,
  PUBLISH_STATUS_TONES,
  PUBLISH_STATUSES,
  PUBLISHED_AT_FORMAT_OPTIONS,
} from "./constants";
import {
  type ContentCategory,
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

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
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
  const published = new Date(iso);
  if (Number.isNaN(published.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("ko-KR", PUBLISHED_AT_FORMAT_OPTIONS).formatToParts(
    published,
  );

  return {
    date: `${readPart(parts, "year")}.${readPart(parts, "month")}.${readPart(parts, "day")}`,
    time: `${readPart(parts, "hour")}:${readPart(parts, "minute")}`,
  };
}

export function parseContentListParams(searchParams: URLSearchParams): ContentListParams {
  return {
    page: parsePage(searchParams.get(CONTENT_LIST_PARAM_KEYS.page), MAX_PAGE),
    limit: DEFAULT_PAGE_LIMIT,
    category: parseCategory(searchParams.get(CONTENT_LIST_PARAM_KEYS.category)),
    publishStatus: parsePublishStatus(searchParams.get(CONTENT_LIST_PARAM_KEYS.publishStatus)),
  };
}
