import { type AuthIntent } from "../../model/auth-error-message";
import { type Credentials } from "../../model/validate-credentials";

export type CredentialsFormProps = {
  intent: AuthIntent;
  onSubmit: (values: Credentials) => void;
  isPending: boolean;
  requestError?: string;
};
