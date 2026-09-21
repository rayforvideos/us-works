import { useLocation, useNavigate } from "react-router";

import { ROUTES } from "@/shared/config";

import { useLoginMutation } from "../../api/useAuthMutations";
import { getAuthErrorMessage } from "../../model/auth-error-message";
import { type Credentials } from "../../model/credentials-schema";
import { CredentialsForm } from "../credentials-form";

function isInternalPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function readRedirectPath(state: unknown): string | null {
  if (typeof state !== "object" || state === null || !("from" in state)) {
    return null;
  }
  const { from } = state;
  return isInternalPath(from) ? from : null;
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const mutation = useLoginMutation();

  function handleSubmit(values: Credentials) {
    mutation.mutate(values, {
      onSuccess: () => {
        void navigate(readRedirectPath(location.state) ?? ROUTES.contents, {
          replace: true,
          viewTransition: true,
        });
      },
    });
  }

  return (
    <CredentialsForm
      intent="login"
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
      requestError={
        mutation.error === null ? undefined : getAuthErrorMessage(mutation.error, "login")
      }
    />
  );
}
