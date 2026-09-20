import { CONTENT_CATEGORIES, type ContentCategory } from "@/entities/content";

import { type ContentFormValues } from "../content-input-schema";
import { CONTENT_DRAFT_KEY, SAVED_AT_FORMAT_OPTIONS } from "./constants";
import { type ContentDraft } from "./types";

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

function parseDraft(raw: string): ContentFormValues | null {
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
    };
  } catch {
    return null;
  }
}

function isEmptyContentFormValues(values: ContentFormValues): boolean {
  return (
    values.title === "" &&
    values.body === "" &&
    values.linkUrl === "" &&
    values.categories.length === 0
  );
}

export function readContentDraft(): ContentFormValues | null {
  const raw = localStorage.getItem(CONTENT_DRAFT_KEY);
  if (raw === null) {
    return null;
  }
  return parseDraft(raw);
}

export function writeContentDraft(values: ContentFormValues): string | null {
  if (isEmptyContentFormValues(values)) {
    return null;
  }
  const draft: ContentDraft = { ...values, savedAt: new Date().toISOString() };
  localStorage.setItem(CONTENT_DRAFT_KEY, JSON.stringify(draft));
  return draft.savedAt;
}

export function clearContentDraft(): void {
  localStorage.removeItem(CONTENT_DRAFT_KEY);
}

export function formatSavedAt(iso: string): string {
  const saved = new Date(iso);
  if (Number.isNaN(saved.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("ko-KR", SAVED_AT_FORMAT_OPTIONS).format(saved);
}
