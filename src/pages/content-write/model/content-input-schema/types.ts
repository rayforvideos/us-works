import { type z } from "zod";

import { type contentInputSchema } from "./content-input-schema";

export type ContentFormValues = z.infer<typeof contentInputSchema>;
