import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/config";

import { useRegisterMutation } from "../../api/useAuthMutations";
import { getAuthErrorMessage } from "../../model/auth-error-message";
import { type Credentials } from "../../model/validate-credentials";
import { CredentialsForm } from "../credentials-form";

export function RegisterForm() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation();

  function handleSubmit(values: Credentials) {
    mutation.mutate(values, {
      onSuccess: () => {
        void navigate(ROUTES.contents, { replace: true });
      },
    });
  }

  return (
    <CredentialsForm
      intent="register"
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
      requestError={
        mutation.error === null ? undefined : getAuthErrorMessage(mutation.error, "register")
      }
    />
  );
}
