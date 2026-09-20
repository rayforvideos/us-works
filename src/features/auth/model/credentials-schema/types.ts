import { type z } from "zod";

import { type credentialsSchema } from "./credentials-schema";

export type Credentials = z.infer<typeof credentialsSchema>;
