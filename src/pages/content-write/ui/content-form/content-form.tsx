import { type SubmitEvent } from "react";
import { useForm } from "@tanstack/react-form";

import { readFieldError } from "@/shared/lib/field-error";
import { FormValuesWatcher } from "@/shared/lib/form-values-watcher";
import { TextArea } from "@/shared/ui/text-area";
import { TextField } from "@/shared/ui/text-field";

import {
  contentInputSchema,
  MAX_BODY_LENGTH,
  MAX_TITLE_LENGTH,
} from "../../model/content-input-schema";
import { CategoryField } from "../category-field";
import { LinkField } from "../link-field";
import { BODY_PLACEHOLDER, CATEGORY_HELPER_TEXT, TITLE_PLACEHOLDER } from "./constants";
import {
  dividerClass,
  formClass,
  groupClass,
  headingClass,
  helperClass,
  sectionClass,
} from "./content-form-variants";
import { type ContentFormProps } from "./types";

export function ContentForm({
  formId,
  defaultValues,
  onSubmit,
  isPending,
  onValuesChange,
}: ContentFormProps) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: contentInputSchema },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  function submitForm(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    form.validateSync("submit");
    void form.handleSubmit();
  }

  return (
    <form id={formId} noValidate onSubmit={submitForm} className={formClass()}>
      <section className={sectionClass()}>
        <div className="flex flex-col gap-2">
          <h2 className={headingClass()}>카테고리</h2>
          <p className={helperClass()}>{CATEGORY_HELPER_TEXT}</p>
        </div>
        <form.Field name="categories">
          {(field) => (
            <CategoryField
              value={field.state.value}
              onChange={field.handleChange}
              error={readFieldError(field.state.meta.errors)}
              disabled={isPending}
            />
          )}
        </form.Field>
      </section>
      <hr className={dividerClass()} />
      <div className={groupClass()}>
        <section className={sectionClass()}>
          <h2 className={headingClass()}>제목</h2>
          <form.Field name="title">
            {(field) => (
              <TextField
                aria-label="제목"
                showCounter
                maxLength={MAX_TITLE_LENGTH}
                placeholder={TITLE_PLACEHOLDER}
                value={field.state.value}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                }}
                error={readFieldError(field.state.meta.errors)}
                disabled={isPending}
              />
            )}
          </form.Field>
        </section>
        <section className={sectionClass()}>
          <h2 className={headingClass()}>내용</h2>
          <form.Field name="body">
            {(field) => (
              <TextArea
                aria-label="내용"
                showCounter
                maxLength={MAX_BODY_LENGTH}
                placeholder={BODY_PLACEHOLDER}
                value={field.state.value}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                }}
                error={readFieldError(field.state.meta.errors)}
                disabled={isPending}
              />
            )}
          </form.Field>
        </section>
      </div>
      <hr className={dividerClass()} />
      <section className={sectionClass()}>
        <h2 className={headingClass()}>링크</h2>
        <form.Field name="linkUrl">
          {(field) => (
            <LinkField
              value={field.state.value}
              onChange={field.handleChange}
              disabled={isPending}
            />
          )}
        </form.Field>
      </section>
      <form.Subscribe selector={(state) => state.values}>
        {(values) => <FormValuesWatcher values={values} onChange={onValuesChange} />}
      </form.Subscribe>
    </form>
  );
}
