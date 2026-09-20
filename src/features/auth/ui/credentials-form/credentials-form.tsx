import { type SubmitEvent, useId } from "react";
import { Link } from "react-router";
import { useForm } from "@tanstack/react-form";

import { readFieldError } from "@/shared/lib/field-error";
import { Button } from "@/shared/ui/button";
import { TextField } from "@/shared/ui/text-field";

import { credentialsSchema } from "../../model/credentials-schema";
import { AUTH_FORM_CONTENT, EMAIL_AUTO_COMPLETE } from "./constants";
import { type CredentialsFormProps } from "./types";

export function CredentialsForm({
  intent,
  onSubmit,
  isPending,
  requestError,
}: CredentialsFormProps) {
  const fieldId = useId();
  const content = AUTH_FORM_CONTENT[intent];
  const emailId = `${fieldId}-email`;
  const passwordId = `${fieldId}-password`;
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: credentialsSchema },
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
    <form noValidate className="flex w-full flex-col" onSubmit={submitForm}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2.5">
          <label htmlFor={emailId} className="text-16-sb600 text-blue-grey-300">
            이메일
          </label>
          <form.Field name="email">
            {(field) => (
              <TextField
                id={emailId}
                name="email"
                type="email"
                autoComplete={EMAIL_AUTO_COMPLETE}
                placeholder="이메일을 입력해주세요."
                value={field.state.value}
                onChange={(event) => {
                  field.setErrorMap({ onSubmit: undefined });
                  field.handleChange(event.target.value);
                }}
                error={readFieldError(field.state.meta.errors)}
                disabled={isPending}
              />
            )}
          </form.Field>
        </div>
        <div className="flex flex-col gap-2.5">
          <label htmlFor={passwordId} className="text-16-sb600 text-blue-grey-300">
            비밀번호
          </label>
          <form.Field name="password">
            {(field) => (
              <TextField
                id={passwordId}
                name="password"
                type="password"
                autoComplete={content.passwordAutoComplete}
                placeholder="비밀번호를 입력해주세요."
                value={field.state.value}
                onChange={(event) => {
                  field.setErrorMap({ onSubmit: undefined });
                  field.handleChange(event.target.value);
                }}
                error={readFieldError(field.state.meta.errors)}
                disabled={isPending}
              />
            )}
          </form.Field>
        </div>
      </div>
      <div className="mt-0 flex flex-col gap-3">
        <p
          role={requestError === undefined ? undefined : "alert"}
          className="min-h-3.5 text-14-sb600 text-red-100"
        >
          {requestError}
        </p>
        <Button type="submit" size="large" fullWidth loading={isPending}>
          {content.submitLabel}
        </Button>
      </div>
      <p className="mt-6 text-center text-14-sb600 text-grey-500">
        {content.linkPrefix}
        <Link to={content.linkTo} className="underline">
          {content.linkLabel}
        </Link>
      </p>
    </form>
  );
}
