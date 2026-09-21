import { type Content, type ContentDraft } from "@/entities/content";

import { type ContentFormValues } from "../content-input-schema";

/**
 * @constants
 */
const EMPTY_FORM_VALUES: ContentFormValues = {
  title: "",
  body: "",
  categories: [],
  linkUrl: "",
};

export function toContentFormValues(draft: ContentDraft | null): ContentFormValues {
  if (draft === null) {
    return EMPTY_FORM_VALUES;
  }
  return {
    title: draft.title,
    body: draft.body,
    categories: draft.categories,
    linkUrl: draft.linkUrl,
  };
}

export function toContentFormValuesFromContent(content: Content): ContentFormValues {
  return {
    title: content.title,
    body: content.body,
    categories: content.categories,
    linkUrl: content.link_url ?? "",
  };
}
