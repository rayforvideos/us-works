import { getTargetTypeLabel, TARGET_TYPES } from "@/entities/notification";
import { readFieldError } from "@/shared/lib/field-error";
import { CheckboxChip } from "@/shared/ui/checkbox-chip";
import { TextField } from "@/shared/ui/text-field";

import { MAX_NOTIFICATION_TITLE_LENGTH } from "../../model/publish-options-schema";
import { applyUseContentTitle, isNotifying } from "../../model/publish-rules";
import { OptionRadioRow } from "../option-radio-row";
import { PublishRow } from "../publish-row";
import {
  NOTIFICATION_TITLE_PLACEHOLDER,
  NOTIFY_HELPER_TEXT,
  NOTIFY_LABELS,
  NOTIFY_VALUES,
  SENT_NOTIFICATION_TEXT,
} from "./constants";
import {
  dividerClass,
  headerBoxClass,
  headingBoxClass,
  notifyHeadingClass,
  notifyHelperClass,
  notifySectionClass,
  rowsClass,
  sentNoticeClass,
  titleBoxClass,
} from "./notify-section-variants";
import { type NotifySectionProps } from "./types";

export function NotifySection({
  form,
  values,
  contentTitle,
  submitting,
  isSent,
}: NotifySectionProps) {
  const isPrivate = values.visibility === "private";
  const isSending = isNotifying(values);
  const isDisabled = submitting || isSent;

  return (
    <section className={notifySectionClass()}>
      <div className={headerBoxClass()}>
        <div className={headingBoxClass()}>
          <h2 className={notifyHeadingClass()}>알람 설정</h2>
          <p className={notifyHelperClass()}>{NOTIFY_HELPER_TEXT}</p>
        </div>
        <hr className={dividerClass()} />
      </div>
      {isSent ? <p className={sentNoticeClass()}>{SENT_NOTIFICATION_TEXT}</p> : null}
      <div className={rowsClass()}>
        <form.Field name="notify">
          {(field) => (
            <OptionRadioRow
              label="발송 여부"
              name="publish-notify"
              options={NOTIFY_VALUES.map((item) => ({ value: item, label: NOTIFY_LABELS[item] }))}
              value={isSending ? "send" : "none"}
              onChange={(next) => {
                field.handleChange(next === "send");
              }}
              disabled={isDisabled || isPrivate}
            />
          )}
        </form.Field>
        {isSending ? (
          <form.Field name="targetType">
            {(field) => (
              <OptionRadioRow
                label="대상자"
                name="publish-target-type"
                options={TARGET_TYPES.map((target) => ({
                  value: target,
                  label: getTargetTypeLabel(target),
                }))}
                value={field.state.value}
                onChange={field.handleChange}
                disabled={isDisabled}
              />
            )}
          </form.Field>
        ) : null}
        {isSending ? (
          <PublishRow label="알람 내용">
            <form.Field name="notificationTitle">
              {(field) => (
                <div className={titleBoxClass()}>
                  <form.Field name="useContentTitle">
                    {(checkboxField) => (
                      <CheckboxChip
                        checked={checkboxField.state.value}
                        disabled={isDisabled}
                        onChange={(event) => {
                          checkboxField.handleChange(event.target.checked);
                          field.handleChange(
                            applyUseContentTitle({
                              useContentTitle: event.target.checked,
                              contentTitle,
                            }),
                          );
                        }}
                      >
                        콘텐츠 제목 사용
                      </CheckboxChip>
                    )}
                  </form.Field>
                  <TextField
                    aria-label="알람 내용"
                    placeholder={NOTIFICATION_TITLE_PLACEHOLDER}
                    maxLength={MAX_NOTIFICATION_TITLE_LENGTH}
                    value={field.state.value}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                    }}
                    error={readFieldError(field.state.meta.errors)}
                    disabled={isDisabled || values.useContentTitle}
                  />
                </div>
              )}
            </form.Field>
          </PublishRow>
        ) : null}
      </div>
    </section>
  );
}
