import { CONTENT_CATEGORIES, getCategoryLabel } from "@/entities/content";
import { CheckboxChip } from "@/shared/ui/checkbox-chip";
import { FieldError } from "@/shared/ui/field-error";

import { toggleCategory } from "../../model/toggle-category";
import { type CategoryFieldProps } from "./types";

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
      <FieldError error={error} />
    </div>
  );
}
