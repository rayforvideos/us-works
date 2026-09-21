import { type SubmitEvent } from "react";
import { useForm } from "@tanstack/react-form";

import {
  getTargetTypeLabel,
  MAX_NOTIFICATION_TITLE_LENGTH,
  TARGET_TYPES,
} from "@/entities/notification";
import { readFieldError } from "@/shared/lib/field-error";
import { toMinDateTime } from "@/shared/lib/seoul-time";
import { DateTimeField } from "@/shared/ui/date-time-field";
import { FieldError } from "@/shared/ui/field-error";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { TextField } from "@/shared/ui/text-field";

import { notificationInputSchema } from "../../model/notification-input-schema";
import { SCHEDULED_AT_PLACEHOLDER, TITLE_PLACEHOLDER } from "./constants";
import {
  formClass,
  labelClass,
  labelRowClass,
  radioGroupClass,
  requestErrorClass,
  sectionClass,
} from "./notification-form-variants";
import { type NotificationFormProps, type SectionLabelProps } from "./types";

function SectionLabel({ label, error, errorId }: SectionLabelProps) {
  return (
    <div className={labelRowClass()}>
      <h2 className={labelClass()}>{label}</h2>
      <FieldError id={errorId} error={error} reserve={false} />
    </div>
  );
}

export function NotificationForm({
  formId,
  defaultValues,
  onSubmit,
  disabled,
  requestError,
  onValuesChange,
}: NotificationFormProps) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: notificationInputSchema },
    listeners: {
      onChange: ({ formApi }) => {
        onValuesChange?.(formApi.state.values);
      },
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });
  const titleErrorId = `${formId}-title-error`;
  const scheduledAtErrorId = `${formId}-scheduled-at-error`;

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    form.validateSync("submit");
    void form.handleSubmit();
  }

  return (
    <form id={formId} noValidate onSubmit={submitForm} className={formClass()}>
      <p role={requestError === undefined ? undefined : "alert"} className={requestErrorClass()}>
        {requestError}
      </p>
      <section className={sectionClass()}>
        <SectionLabel label="대상자" />
        <form.Field name="targetType">
          {(field) => (
            <RadioGroup
              name={`${formId}-target-type`}
              aria-label="대상자"
              className={radioGroupClass()}
              value={field.state.value}
              onValueChange={(value) => {
                const next = TARGET_TYPES.find((target) => target === value);
                if (next) {
                  field.handleChange(next);
                }
              }}
              disabled={disabled}
            >
              {TARGET_TYPES.map((target) => (
                <RadioGroupItem key={target} value={target} label={getTargetTypeLabel(target)} />
              ))}
            </RadioGroup>
          )}
        </form.Field>
      </section>
      <form.Field name="title">
        {(field) => {
          const error = readFieldError(field.state.meta.errors);

          return (
            <section className={sectionClass()}>
              <SectionLabel label="제목" error={error} errorId={titleErrorId} />
              <TextField
                aria-label="제목"
                aria-describedby={error === undefined ? undefined : titleErrorId}
                showCounter
                maxLength={MAX_NOTIFICATION_TITLE_LENGTH}
                placeholder={TITLE_PLACEHOLDER}
                reserveError={false}
                value={field.state.value}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                }}
                invalid={error !== undefined}
                disabled={disabled}
              />
            </section>
          );
        }}
      </form.Field>
      <form.Field name="scheduledAt">
        {(field) => {
          const error = readFieldError(field.state.meta.errors);

          return (
            <section className={sectionClass()}>
              <SectionLabel label="시간" error={error} errorId={scheduledAtErrorId} />
              <DateTimeField
                aria-label="발송 시간"
                aria-describedby={error === undefined ? undefined : scheduledAtErrorId}
                placeholder={SCHEDULED_AT_PLACEHOLDER}
                min={toMinDateTime(new Date())}
                value={field.state.value}
                onValueChange={field.handleChange}
                invalid={error !== undefined}
                disabled={disabled}
              />
            </section>
          );
        }}
      </form.Field>
    </form>
  );
}
