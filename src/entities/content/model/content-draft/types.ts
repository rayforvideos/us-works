import { type ContentCategory } from "../content";

export type ContentDraftValues = {
  title: string;
  body: string;
  categories: ContentCategory[];
  linkUrl: string;
};

export type ContentDraft = ContentDraftValues & {
  savedAt: string;
};
