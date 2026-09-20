import { useState } from "react";
import { useNavigate } from "react-router";

import {
  clearContentDraft,
  CONTENT_FORM_ID,
  ContentForm,
  type ContentFormValues,
  formatSavedAt,
  readContentDraft,
  toContentInput,
  useCreateContentMutation,
  useDraftAutosave,
} from "@/features/edit-content";
import { ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Gnb } from "@/widgets/gnb";

/**
 * @constants
 */
const EMPTY_VALUES: ContentFormValues = { title: "", body: "", categories: [], linkUrl: "" };

export function ContentCreateView() {
  const navigate = useNavigate();
  const [initialValues] = useState<ContentFormValues>(() => readContentDraft() ?? EMPTY_VALUES);
  const [values, setValues] = useState<ContentFormValues>(initialValues);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const mutation = useCreateContentMutation();
  const { saveNow } = useDraftAutosave({
    enabled: true,
    getValues: () => values,
    onSaved: setSavedAt,
  });

  function createContentFromValues(next: ContentFormValues) {
    mutation.mutate(toContentInput(next, { editing: false }), {
      onSuccess: () => {
        clearContentDraft();
        void navigate(ROUTES.contents, { replace: true });
      },
    });
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
            <Button size="medium" type="submit" form={CONTENT_FORM_ID} loading={mutation.isPending}>
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
          onSubmit={createContentFromValues}
          isPending={mutation.isPending}
          requestError={mutation.error === null ? undefined : getErrorMessage(mutation.error)}
        />
      </Container>
    </>
  );
}
