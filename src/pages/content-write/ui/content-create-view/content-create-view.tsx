import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { clearContentDraft, formatSavedAt, readContentDraft } from "@/entities/content";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Gnb } from "@/widgets/gnb";

import { usePublishContentMutation } from "../../api/usePublishContentMutation";
import { type ContentFormValues } from "../../model/content-input-schema";
import { toContentFormValues } from "../../model/draft-form-values";
import { type PublishOptionsValues } from "../../model/publish-options-schema";
import { toContentInput } from "../../model/to-content-input";
import { useDraftAutosave } from "../../model/useDraftAutosave";
import { CONTENT_FORM_ID, ContentForm } from "../content-form";
import { PublishOptionsDialog } from "../publish-options-dialog";

export function ContentCreateView() {
  const navigate = useNavigate();
  const publishButtonRef = useRef<HTMLButtonElement>(null);
  const [initialValues] = useState<ContentFormValues>(() =>
    toContentFormValues(readContentDraft()),
  );
  const [values, setValues] = useState<ContentFormValues>(initialValues);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishValues, setPublishValues] = useState<ContentFormValues | null>(null);
  const [savedContentId, setSavedContentId] = useState<string | null>(null);
  const mutation = usePublishContentMutation({ onContentSaved: setSavedContentId });
  const { saveNow } = useDraftAutosave({
    enabled: true,
    getValues: () => values,
    onSaved: setSavedAt,
  });

  function publishContent(options: PublishOptionsValues) {
    if (publishValues === null || mutation.isPending) {
      return;
    }
    mutation.mutate(
      {
        contentId: savedContentId,
        contentInput: toContentInput(publishValues, { editing: savedContentId !== null }),
        values: options,
        contentTitle: publishValues.title,
      },
      {
        onSuccess: () => {
          clearContentDraft();
          void navigate(ROUTES.contents, { replace: true });
        },
      },
    );
  }

  return (
    <>
      <Gnb
        title="콘텐츠 쓰기"
        message={
          savedAt === null ? undefined : `해당 글이 임시 저장되었습니다 ${formatSavedAt(savedAt)}`
        }
        onBack={() => {
          void navigate(ROUTES.contents);
        }}
        actions={
          <>
            <Button importance="secondary" size="medium" type="button" onClick={saveNow}>
              임시저장
            </Button>
            <Button
              ref={publishButtonRef}
              size="medium"
              type="submit"
              form={CONTENT_FORM_ID}
              loading={mutation.isPending}
            >
              발행하기
            </Button>
          </>
        }
      />
      <Container as="main" className="py-14">
        <ContentForm
          formId={CONTENT_FORM_ID}
          defaultValues={initialValues}
          onValuesChange={setValues}
          onSubmit={setPublishValues}
          isPending={mutation.isPending}
        />
      </Container>
      {publishValues === null ? null : (
        <PublishOptionsDialog
          open
          onOpenChange={() => {
            setPublishValues(null);
          }}
          content={null}
          notification={null}
          contentTitle={publishValues.title}
          submitting={mutation.isPending}
          requestError={mutation.error === null ? undefined : getErrorMessage(mutation.error)}
          finalFocus={publishButtonRef}
          onSubmit={publishContent}
        />
      )}
    </>
  );
}
