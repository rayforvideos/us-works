import { type ContentCategory, type PublishStatus, type PublishStatusTone } from "./types";

export const CONTENT_CATEGORIES = [
  "secondaryBattery",
  "realty",
  "investment",
  "domesticStock",
  "economicTheory",
  "foreignStock",
  "cryptoCurrency",
  "companyAnalysis",
  "macroEconomics",
  "personalFinance",
  "safeAsset",
] as const;

export const PUBLISH_STATUSES = ["draft", "scheduled", "published"] as const;

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  secondaryBattery: "2차전지",
  realty: "부동산",
  investment: "투자기법",
  domesticStock: "국내주식",
  economicTheory: "경제원론",
  foreignStock: "해외주식",
  cryptoCurrency: "암호화폐",
  companyAnalysis: "기업분석",
  macroEconomics: "거시경제",
  personalFinance: "재테크",
  safeAsset: "안전자산",
};

export const PUBLISH_STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "비공개",
  scheduled: "예약",
  published: "공개",
};

export const PUBLISH_STATUS_TONES: Record<PublishStatus, PublishStatusTone> = {
  draft: "grey",
  scheduled: "yellow",
  published: "green",
};

export const CONTENT_LIST_PARAM_KEYS = {
  page: "page",
  category: "category",
  publishStatus: "publish_status",
} as const;

export const DEFAULT_PAGE_LIMIT = 10;

export const MAX_PAGE = 9999;

export const PUBLISHED_AT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Seoul",
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};
