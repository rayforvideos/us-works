import { type ChangeEvent, type SubmitEvent, useId, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/shared/ui/button";
import { TextField } from "@/shared/ui/text-field";

import {
  type Credentials,
  type CredentialsErrors,
  validateCredentials,
} from "../../model/validate-credentials";
import { AUTH_FORM_CONTENT, EMAIL_AUTO_COMPLETE } from "./constants";
import { type CredentialsFormProps } from "./types";

function hasError(errors: CredentialsErrors): boolean {
  return errors.email !== undefined || errors.password !== undefined;
}

export function CredentialsForm({
  intent,
  onSubmit,
  isPending,
  requestError,
}: CredentialsFormProps) {
  const fieldId = useId();
  const [values, setValues] = useState<Credentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<CredentialsErrors>({});
  const content = AUTH_FORM_CONTENT[intent];
  const emailId = `${fieldId}-email`;
  const passwordId = `${fieldId}-password`;

  function updateValue(field: keyof Credentials, event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCredentials(values);
    setErrors(nextErrors);
    if (hasError(nextErrors)) {
      return;
    }
    onSubmit(values);
  }

  return (
    <form noValidate className="flex w-full flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2.5">
          <label htmlFor={emailId} className="text-16-sb600 text-blue-grey-300">
            이메일
          </label>
          <TextField
            id={emailId}
            name="email"
            type="email"
            autoComplete={EMAIL_AUTO_COMPLETE}
            placeholder="이메일을 입력해주세요."
            value={values.email}
            onChange={(event) => {
              updateValue("email", event);
            }}
            error={errors.email}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <label htmlFor={passwordId} className="text-16-sb600 text-blue-grey-300">
            비밀번호
          </label>
          <TextField
            id={passwordId}
            name="password"
            type="password"
            autoComplete={content.passwordAutoComplete}
            placeholder="비밀번호를 입력해주세요."
            value={values.password}
            onChange={(event) => {
              updateValue("password", event);
            }}
            error={errors.password}
            disabled={isPending}
          />
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
