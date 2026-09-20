import {
  EMAIL_FORMAT_MESSAGE,
  EMAIL_PATTERN,
  EMAIL_REQUIRED_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_LENGTH_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from "./constants";
import { type Credentials, type CredentialsErrors } from "./types";

function validateEmail(email: string): string | undefined {
  if (email.length === 0) {
    return EMAIL_REQUIRED_MESSAGE;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return EMAIL_FORMAT_MESSAGE;
  }
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (password.length === 0) {
    return PASSWORD_REQUIRED_MESSAGE;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return PASSWORD_LENGTH_MESSAGE;
  }
  return undefined;
}

export function validateCredentials({ email, password }: Credentials): CredentialsErrors {
  const errors: CredentialsErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError !== undefined) {
    errors.email = emailError;
  }
  if (passwordError !== undefined) {
    errors.password = passwordError;
  }
  return errors;
}
