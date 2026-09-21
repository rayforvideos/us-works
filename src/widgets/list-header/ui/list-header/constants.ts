import { ROUTES } from "@/shared/config";

import { type ListHeaderTab } from "./types";

export const LIST_TABS: readonly ListHeaderTab[] = [
  { label: "콘텐츠", to: ROUTES.contents, end: true },
  { label: "알람", to: ROUTES.alarms },
];
