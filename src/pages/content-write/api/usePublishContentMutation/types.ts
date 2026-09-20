import { type ContentInput } from "@/entities/content";

import { type PublishOptionsValues } from "../../model/publish-options-schema";

export type PublishContentVariables = {
  contentId: string | null;
  contentInput: ContentInput;
  values: PublishOptionsValues;
  contentTitle: string;
};

export type PublishMutationOptions = {
  onContentSaved?: (contentId: string) => void;
};
