import { CONTENT_CATEGORIES, type ContentCategory } from "../content";
import {
  CONTENT_DRAFT_KEY,
  SAVED_AT_DATE_TIME_FORMAT_OPTIONS,
  SAVED_AT_FORMAT_OPTIONS,
} from "./constants";
import { type ContentDraft, type ContentDraftValues } from "./types";

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value : "";
}

function readCategories(source: Record<string, unknown>): ContentCategory[] {
  const value = source.categories;
  if (!Array.isArray(value)) {
    return [];
  }
  return CONTENT_CATEGORIES.filter((category) => value.includes(category));
}

function parseDraft(raw: string): ContentDraft | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const source = parsed as Record<string, unknown>;
    return {
      title: readString(source, "title"),
      body: readString(source, "body"),
      categories: readCategories(source),
      linkUrl: readString(source, "linkUrl"),
      savedAt: readString(source, "savedAt"),
    };
  } catch {
    return null;
  }
}

function isEmptyDraftValues(values: ContentDraftValues): boolean {
  return (
    values.title === "" &&
    values.body === "" &&
    values.linkUrl === "" &&
    values.categories.length === 0
  );
}

function parseSavedAt(iso: string): Date | null {
  const saved = new Date(iso);
  if (Number.isNaN(saved.getTime())) {
    return null;
  }
  return saved;
}

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function readRawDraft(): string | null {
  try {
    return localStorage.getItem(CONTENT_DRAFT_KEY);
  } catch {
    return null;
  }
}

export function readContentDraft(): ContentDraft | null {
  const raw = readRawDraft();
  if (raw === null) {
    return null;
  }
  const draft = parseDraft(raw);
  if (draft === null || draft.savedAt === "" || isEmptyDraftValues(draft)) {
    return null;
  }
  return draft;
}

export function writeContentDraft(values: ContentDraftValues): string | null {
  if (isEmptyDraftValues(values)) {
    return null;
  }
  const draft: ContentDraft = {
    title: values.title,
    body: values.body,
    categories: values.categories,
    linkUrl: values.linkUrl,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONTENT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    return null;
  }
  return draft.savedAt;
}

export function clearContentDraft(): void {
  try {
    localStorage.removeItem(CONTENT_DRAFT_KEY);
  } catch {
    return;
  }
}

export function formatSavedAt(iso: string): string {
  const saved = parseSavedAt(iso);
  if (saved === null) {
    return "";
  }
  return new Intl.DateTimeFormat("ko-KR", SAVED_AT_FORMAT_OPTIONS).format(saved);
}

export function formatSavedAtDateTime(iso: string): string {
  const saved = parseSavedAt(iso);
  if (saved === null) {
    return "";
  }
  const parts = new Intl.DateTimeFormat("ko-KR", SAVED_AT_DATE_TIME_FORMAT_OPTIONS).formatToParts(
    saved,
  );
  const date = `${readPart(parts, "year")}년 ${readPart(parts, "month")}월 ${readPart(parts, "day")}일`;

  return `${date} ${readPart(parts, "hour")}:${readPart(parts, "minute")}`;
}
