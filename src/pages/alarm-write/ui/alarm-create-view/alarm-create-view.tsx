import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { contentQueries } from "@/entities/content";
import { useHttpClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { LinkNotice } from "@/shared/ui/link-notice";
import { Spinner } from "@/shared/ui/spinner";

import { useCreateNotificationMutation } from "../../api/useNotificationMutations";
import { canNotifyContent } from "../../model/can-notify-content";
import {
  getNotificationErrorMessage,
  PRIVATE_CONTENT_MESSAGE,
} from "../../model/notification-error-message";
import { type NotificationFormValues } from "../../model/notification-input-schema";
import { isSameNotificationValues, toNotificationInput } from "../../model/to-notification-input";
import { AlarmWriteLayout } from "../alarm-write-layout";
import { NOTIFICATION_FORM_ID, NotificationForm } from "../notification-form";
import { type AlarmCreateViewProps } from "./types";

/**
 * @constants
 */
const INITIAL_VALUES: NotificationFormValues = {
  targetType: "all",
  title: "",
  scheduledAt: "",
};

export function AlarmCreateView({ contentId }: AlarmCreateViewProps) {
  const navigate = useNavigate();
  const client = useHttpClient();
  const { data, isPending, error } = useQuery(contentQueries.detail(client, String(contentId)));
  const mutation = useCreateNotificationMutation();
  const [values, setValues] = useState<NotificationFormValues>(INITIAL_VALUES);
  const canNotify = data !== undefined && canNotifyContent(data);

  function createNotificationFromValues(next: NotificationFormValues) {
    mutation.mutate(toNotificationInput(next, contentId), {
      onSuccess: () => {
        void navigate(ROUTES.alarms, { replace: true });
      },
    });
  }

  return (
    <AlarmWriteLayout
      isDirty={!isSameNotificationValues(INITIAL_VALUES, values)}
      actions={
        canNotify ? (
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
          <Spinner aria-label="콘텐츠 불러오는 중" />
        </div>
      ) : null}
      {error === null ? null : (
        <LinkNotice message={getErrorMessage(error)} linkLabel="목록으로" to={ROUTES.contents} />
      )}
      {data && !canNotify ? (
        <LinkNotice message={PRIVATE_CONTENT_MESSAGE} linkLabel="목록으로" to={ROUTES.contents} />
      ) : null}
      {canNotify ? (
        <NotificationForm
          formId={NOTIFICATION_FORM_ID}
          defaultValues={INITIAL_VALUES}
          onValuesChange={setValues}
          onSubmit={createNotificationFromValues}
          disabled={mutation.isPending}
          requestError={
            mutation.error === null ? undefined : getNotificationErrorMessage(mutation.error)
          }
        />
      ) : null}
    </AlarmWriteLayout>
  );
}
