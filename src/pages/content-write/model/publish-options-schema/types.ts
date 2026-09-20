import { type z } from "zod";

import { type publishOptionsSchema } from "./publish-options-schema";

export type PublishOptionsValues = z.infer<typeof publishOptionsSchema>;

export type PublishVisibility = PublishOptionsValues["visibility"];
