import { Link, useNavigate } from "react-router";

import { type Content, useContentQuery } from "@/entities/content";
import {
  CONTENT_FORM_ID,
  ContentForm,
  type ContentFormValues,
  toContentInput,
  useUpdateContentMutation,
} from "@/features/edit-content";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Spinner } from "@/shared/ui/spinner";
import { Gnb } from "@/widgets/gnb";

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
  const { data, isPending, error } = useContentQuery(id);
  const mutation = useUpdateContentMutation(id);

  function updateContentFromValues(next: ContentFormValues) {
    mutation.mutate(toContentInput(next, { editing: true }), {
      onSuccess: () => {
        void navigate(ROUTES.contents, { replace: true });
      },
    });
  }

  return (
    <>
      <Gnb
        title="콘텐츠 쓰기"
        onBack={() => {
          void navigate(ROUTES.contents);
        }}
        actions={
          <Button size="medium" type="submit" form={CONTENT_FORM_ID} loading={mutation.isPending}>
            발행하기
          </Button>
        }
      />
      <Container as="main" className="py-14">
        {isPending ? (
          <div className="flex justify-center">
            <Spinner aria-label="콘텐츠 불러오는 중" />
          </div>
        ) : null}
        {error === null ? null : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-14-sb600 text-grey-500">{getErrorMessage(error)}</p>
            <Link to={ROUTES.contents} className="text-14-sb600 text-blue-green-90 underline">
              목록으로
            </Link>
          </div>
        )}
        {data ? (
          <ContentForm
            formId={CONTENT_FORM_ID}
            defaultValues={toFormValues(data)}
            onSubmit={updateContentFromValues}
            isPending={mutation.isPending}
            requestError={mutation.error === null ? undefined : getErrorMessage(mutation.error)}
          />
        ) : null}
      </Container>
    </>
  );
}
