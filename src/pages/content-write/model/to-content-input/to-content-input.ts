import { type ContentInput } from "@/entities/content";

import { type ContentFormValues } from "../content-input-schema";

export function toContentInput(
  values: ContentFormValues,
  { editing }: { editing: boolean },
): ContentInput {
  const input: ContentInput = {
    title: values.title,
    body: values.body,
    categories: values.categories,
  };

  if (values.linkUrl !== "") {
    return { ...input, link_url: values.linkUrl };
  }
  if (editing) {
    return { ...input, link_url: "" };
  }
  return input;
}
