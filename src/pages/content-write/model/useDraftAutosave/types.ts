import { type ContentFormValues } from "../content-input-schema";

export type DraftAutosaveOptions = {
  getValues: () => ContentFormValues;
  onSaved: (savedAt: string) => void;
};

export type SaveDraft = (options: { onlyWhenChanged: boolean }) => void;
