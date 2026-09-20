import { type ContentFormValues } from "../content-input-schema";

export type ContentDraft = ContentFormValues & { savedAt: string };
