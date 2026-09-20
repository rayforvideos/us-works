import { type ContentCategory } from "@/entities/content";

import { MAX_CATEGORIES } from "../content-input-schema";

export function toggleCategory(
  selected: ContentCategory[],
  category: ContentCategory,
): ContentCategory[] {
  if (selected.includes(category)) {
    return selected.filter((item) => item !== category);
  }
  if (selected.length >= MAX_CATEGORIES) {
    return selected;
  }
  return [...selected, category];
}
