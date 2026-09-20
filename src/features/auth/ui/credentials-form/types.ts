import { type AuthIntent } from "../../model/auth-error-message";
import { type Credentials } from "../../model/credentials-schema";

export type CredentialsFormProps = {
  intent: AuthIntent;
  onSubmit: (values: Credentials) => void;
  isPending: boolean;
  requestError?: string;
};
