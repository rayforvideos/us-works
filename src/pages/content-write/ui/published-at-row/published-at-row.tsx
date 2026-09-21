import { readFieldError } from "@/shared/lib/field-error";
import { toMinDateTime } from "@/shared/lib/seoul-time";
import { DateTimeField } from "@/shared/ui/date-time-field";
import { FieldError } from "@/shared/ui/field-error";

import { PublishRow } from "../publish-row";
import { PUBLISHED_AT_ERROR_ID, PUBLISHED_AT_PLACEHOLDER } from "./constants";
import { type PublishedAtRowProps } from "./types";

export function PublishedAtRow({ form, submitting }: PublishedAtRowProps) {
  return (
    <PublishRow label="예약 발행">
      <form.Field name="publishedAt">
        {(field) => {
          const error = readFieldError(field.state.meta.errors);

          return (
            <>
              <DateTimeField
                aria-label="예약 발행"
                aria-describedby={error === undefined ? undefined : PUBLISHED_AT_ERROR_ID}
                placeholder={PUBLISHED_AT_PLACEHOLDER}
                min={toMinDateTime(new Date())}
                value={field.state.value}
                onValueChange={field.handleChange}
                invalid={error !== undefined}
                disabled={submitting}
              />
              <FieldError id={PUBLISHED_AT_ERROR_ID} error={error} />
            </>
          );
        }}
      </form.Field>
    </PublishRow>
  );
}
