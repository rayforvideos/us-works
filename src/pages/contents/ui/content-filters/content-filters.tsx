import {
  CONTENT_CATEGORIES,
  type ContentCategory,
  type ContentListFilters,
  getCategoryLabel,
  PUBLISH_STATUS_LABELS,
  PUBLISH_STATUSES,
  type PublishStatus,
} from "@/entities/content";
import { Select, type SelectItem } from "@/shared/ui/select";

/**
 * @types
 */
type ContentFiltersProps = ContentListFilters & {
  onChange: (next: ContentListFilters) => void;
};

/**
 * @constants
 */
const ALL_VALUE = "all";

const ALL_ITEM: SelectItem = { value: ALL_VALUE, label: "전체" };

const CATEGORY_ITEMS: readonly SelectItem[] = [
  ALL_ITEM,
  ...CONTENT_CATEGORIES.map((category) => ({ value: category, label: getCategoryLabel(category) })),
];

const STATUS_ITEMS: readonly SelectItem[] = [
  ALL_ITEM,
  ...PUBLISH_STATUSES.map((status) => ({ value: status, label: PUBLISH_STATUS_LABELS[status] })),
];

function toFilterValue<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((item) => item === value);
}

export function ContentFilters({ category, publishStatus, onChange }: ContentFiltersProps) {
  return (
    <div className="flex justify-end gap-2">
      <Select
        aria-label="카테고리"
        placeholder="카테고리"
        className="w-30"
        items={CATEGORY_ITEMS}
        value={category ?? null}
        onValueChange={(value) => {
          onChange({
            category: toFilterValue<ContentCategory>(value, CONTENT_CATEGORIES),
            publishStatus,
          });
        }}
      />
      <Select
        aria-label="상태"
        placeholder="상태"
        className="w-59.5"
        items={STATUS_ITEMS}
        value={publishStatus ?? null}
        onValueChange={(value) => {
          onChange({
            category,
            publishStatus: toFilterValue<PublishStatus>(value, PUBLISH_STATUSES),
          });
        }}
      />
    </div>
  );
}
