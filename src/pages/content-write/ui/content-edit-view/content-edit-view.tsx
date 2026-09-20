import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { type Content, useContentNotificationQuery, useContentQuery } from "@/entities/content";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { LinkNotice } from "@/shared/ui/link-notice";
import { Spinner } from "@/shared/ui/spinner";
import { Gnb } from "@/widgets/gnb";

import { usePublishContentMutation } from "../../api/usePublishContentMutation";
import { type ContentFormValues } from "../../model/content-input-schema";
import { type PublishOptionsValues } from "../../model/publish-options-schema";
import { toContentInput } from "../../model/to-content-input";
import { CONTENT_FORM_ID, ContentForm } from "../content-form";
import { PublishOptionsDialog } from "../publish-options-dialog";
import { type ContentEditViewProps } from "./types";

function toFormValues(content: Content): ContentFormValues {
  return {
    title: content.title,
    body: content.body,
    categories: content.categories,
    linkUrl: content.link_url ?? "",
  };
}

export function ContentEditView({ id }: ContentEditViewProps) {
  const navigate = useNavigate();
  const publishButtonRef = useRef<HTMLButtonElement>(null);
  const { data, isPending, error } = useContentQuery(id);
  const notificationQuery = useContentNotificationQuery(id);
  const [publishValues, setPublishValues] = useState<ContentFormValues | null>(null);
  const mutation = usePublishContentMutation();

  function publishContent(options: PublishOptionsValues) {
    if (publishValues === null || mutation.isPending) {
      return;
    }
    mutation.mutate(
      {
        contentId: id,
        contentInput: toContentInput(publishValues, { editing: true }),
        values: options,
        contentTitle: publishValues.title,
      },
      {
        onSuccess: () => {
          void navigate(ROUTES.contents, { replace: true });
        },
      },
    );
  }

  return (
    <>
      <Gnb
        title="콘텐츠 쓰기"
        onBack={() => {
          void navigate(ROUTES.contents);
        }}
        actions={
          data ? (
            <Button
              ref={publishButtonRef}
              size="medium"
              type="submit"
              form={CONTENT_FORM_ID}
              loading={mutation.isPending}
            >
              발행하기
            </Button>
          ) : undefined
        }
      />
      <Container as="main" className="py-14">
        {isPending ? (
          <div className="flex justify-center">
            <Spinner aria-label="콘텐츠 불러오는 중" />
          </div>
        ) : null}
        {error === null ? null : (
          <LinkNotice message={getErrorMessage(error)} linkLabel="목록으로" to={ROUTES.contents} />
        )}
        {data ? (
          <ContentForm
            formId={CONTENT_FORM_ID}
            defaultValues={toFormValues(data)}
            onSubmit={setPublishValues}
            isPending={mutation.isPending}
          />
        ) : null}
      </Container>
      {data && publishValues !== null ? (
        <PublishOptionsDialog
          open
          onOpenChange={() => {
            setPublishValues(null);
          }}
          content={data}
          notification={notificationQuery.data ?? null}
          contentTitle={publishValues.title}
          submitting={mutation.isPending}
          requestError={mutation.error === null ? undefined : getErrorMessage(mutation.error)}
          finalFocus={publishButtonRef}
          onSubmit={publishContent}
        />
      ) : null}
    </>
  );
}
