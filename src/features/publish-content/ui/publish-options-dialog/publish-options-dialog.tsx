import { type SubmitEvent } from "react";

import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";

import { PUBLISH_VISIBILITIES } from "../../model/publish-options-schema";
import { canSchedule } from "../../model/publish-rules";
import { usePublishOptionsForm } from "../../model/usePublishOptionsForm";
import { NotifySection } from "../notify-section";
import { OptionRadioRow } from "../option-radio-row";
import { PublishedAtRow } from "../published-at-row";
import { PUBLISH_OPTIONS_FORM_ID, SCHEDULE_DISABLED_VALUES, VISIBILITY_LABELS } from "./constants";
import {
  bodyClass,
  footerActionsClass,
  footerContentClass,
  formClass,
  headerClass,
  requestErrorClass,
  sectionsClass,
} from "./publish-options-dialog-variants";
import { type PublishOptionsDialogProps } from "./types";

export function PublishOptionsDialog({
  open,
  onOpenChange,
  content,
  notification,
  contentTitle,
  submitting,
  requestError,
  finalFocus,
  onSubmit,
}: PublishOptionsDialogProps) {
  const form = usePublishOptionsForm({ content, notification, onSubmit });
  const isScheduleAllowed = canSchedule(content);
  const isSent = notification?.send_status === "sent";

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    form.validateSync("submit");
    void form.handleSubmit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="발행하기"
      disableOutsideClick={submitting}
      headerClassName={headerClass()}
      bodyClassName={bodyClass()}
      finalFocus={finalFocus}
      footer={
        <div className={footerContentClass()}>
          <p
            role={requestError === undefined ? undefined : "alert"}
            className={requestErrorClass()}
          >
            {requestError}
          </p>
          <div className={footerActionsClass()}>
            <Button
              variant="solid"
              importance="assistive"
              size="medium"
              disabled={submitting}
              onClick={() => {
                onOpenChange(false);
              }}
            >
              취소
            </Button>
            <Button
              size="medium"
              type="submit"
              form={PUBLISH_OPTIONS_FORM_ID}
              loading={submitting}
              disabled={submitting}
            >
              발행하기
            </Button>
          </div>
        </div>
      }
    >
      <form id={PUBLISH_OPTIONS_FORM_ID} noValidate onSubmit={submitForm} className={formClass()}>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <div className={sectionsClass()}>
              <form.Field name="visibility">
                {(field) => (
                  <OptionRadioRow
                    label="공개 여부"
                    name="publish-visibility"
                    options={PUBLISH_VISIBILITIES.map((item) => ({
                      value: item,
                      label: VISIBILITY_LABELS[item],
                    }))}
                    value={field.state.value}
                    onChange={(next) => {
                      const picked = PUBLISH_VISIBILITIES.find((item) => item === next);
                      if (picked) {
                        field.handleChange(picked);
                      }
                    }}
                    disabled={submitting}
                    disabledValues={isScheduleAllowed ? undefined : SCHEDULE_DISABLED_VALUES}
                  />
                )}
              </form.Field>
              {values.visibility === "scheduled" ? (
                <PublishedAtRow form={form} submitting={submitting} />
              ) : null}
              <NotifySection
                form={form}
                values={values}
                contentTitle={contentTitle}
                submitting={submitting}
                isSent={isSent}
              />
            </div>
          )}
        </form.Subscribe>
      </form>
    </Dialog>
  );
}
