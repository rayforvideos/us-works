import { z } from "zod";

import {
  EMAIL_FORMAT_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_LENGTH_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from "./constants";

export const credentialsSchema = z.object({
  email: z.string().min(1, EMAIL_REQUIRED_MESSAGE).check(z.email(EMAIL_FORMAT_MESSAGE)),
  password: z
    .string()
    .min(1, PASSWORD_REQUIRED_MESSAGE)
    .min(MIN_PASSWORD_LENGTH, PASSWORD_LENGTH_MESSAGE),
});
