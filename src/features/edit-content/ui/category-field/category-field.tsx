import { CONTENT_CATEGORIES, type ContentCategory, getCategoryLabel } from "@/entities/content";
import { CheckboxChip } from "@/shared/ui/checkbox-chip";

import { MAX_CATEGORIES } from "../../model/content-input-schema";
import { type CategoryFieldProps } from "./types";

function toggleCategory(value: ContentCategory[], category: ContentCategory): ContentCategory[] {
  if (value.includes(category)) {
    return value.filter((selected) => selected !== category);
  }
  if (value.length >= MAX_CATEGORIES) {
    return value;
  }
  return [...value, category];
}

export function CategoryField({ value, onChange, error, disabled = false }: CategoryFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {CONTENT_CATEGORIES.map((category) => (
          <CheckboxChip
            key={category}
            checked={value.includes(category)}
            disabled={disabled}
            onChange={() => {
              onChange(toggleCategory(value, category));
            }}
          >
            {getCategoryLabel(category)}
          </CheckboxChip>
        ))}
      </div>
      <p className="min-h-3 text-12-r400 text-red-100">{error}</p>
    </div>
  );
}
