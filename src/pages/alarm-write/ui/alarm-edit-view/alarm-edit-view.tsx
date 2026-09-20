import { useState } from "react";
import { useNavigate } from "react-router";

import { useNotificationQuery } from "@/entities/notification";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { LinkNotice } from "@/shared/ui/link-notice";
import { Spinner } from "@/shared/ui/spinner";

import { useUpdateNotificationMutation } from "../../api/useNotificationMutations";
import { getNotificationErrorMessage } from "../../model/notification-error-message";
import { type NotificationFormValues } from "../../model/notification-input-schema";
import {
  diffNotificationUpdate,
  isSameNotificationValues,
  toNotificationFormValues,
} from "../../model/to-notification-input";
import { AlarmWriteLayout } from "../alarm-write-layout";
import { NOTIFICATION_FORM_ID, NotificationForm } from "../notification-form";
import { SENT_NOTIFICATION_TEXT } from "./constants";
import { type AlarmEditViewProps } from "./types";

export function AlarmEditView({ id }: AlarmEditViewProps) {
  const navigate = useNavigate();
  const { data, isPending, error } = useNotificationQuery(id);
  const mutation = useUpdateNotificationMutation(id);
  const [values, setValues] = useState<NotificationFormValues | null>(null);
  const initialValues = data === undefined ? null : toNotificationFormValues(data);
  const isEditable = data?.send_status === "pending";

  function updateNotificationFromValues(next: NotificationFormValues) {
    if (initialValues === null) {
      return;
    }
    if (isSameNotificationValues(initialValues, next)) {
      void navigate(ROUTES.alarms, { replace: true });
      return;
    }
    mutation.mutate(diffNotificationUpdate(initialValues, next), {
      onSuccess: () => {
        void navigate(ROUTES.alarms, { replace: true });
      },
    });
  }

  return (
    <AlarmWriteLayout
      isDirty={
        initialValues !== null &&
        values !== null &&
        !isSameNotificationValues(initialValues, values)
      }
      actions={
        isEditable ? (
          <Button
            size="medium"
            type="submit"
            form={NOTIFICATION_FORM_ID}
            loading={mutation.isPending}
          >
            발송하기
          </Button>
        ) : undefined
      }
    >
      {isPending ? (
        <div className="flex justify-center">
          <Spinner aria-label="알림 불러오는 중" />
        </div>
      ) : null}
      {error === null ? null : (
        <LinkNotice message={getErrorMessage(error)} linkLabel="목록으로" to={ROUTES.alarms} />
      )}
      {initialValues !== null && !isEditable ? (
        <p className="mx-auto w-full max-w-165 pb-6 text-12-m500 text-grey-300">
          {SENT_NOTIFICATION_TEXT}
        </p>
      ) : null}
      {initialValues === null ? null : (
        <NotificationForm
          formId={NOTIFICATION_FORM_ID}
          defaultValues={initialValues}
          onValuesChange={setValues}
          onSubmit={updateNotificationFromValues}
          disabled={!isEditable || mutation.isPending}
          requestError={
            mutation.error === null ? undefined : getNotificationErrorMessage(mutation.error)
          }
        />
      )}
    </AlarmWriteLayout>
  );
}
