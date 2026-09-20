import { useForm } from "@tanstack/react-form";

import { type Content } from "@/entities/content";
import { type Notification } from "@/entities/notification";

import { toPublishOptionsValues } from "../publish-initial-values";
import { publishOptionsSchema, type PublishOptionsValues } from "../publish-options-schema";

/**
 * @types
 */
type PublishOptionsFormInput = {
  content: Content | null;
  notification: Notification | null;
  onSubmit: (values: PublishOptionsValues) => void;
};

export function usePublishOptionsForm({
  content,
  notification,
  onSubmit,
}: PublishOptionsFormInput) {
  return useForm({
    defaultValues: toPublishOptionsValues({ content, notification }),
    validators: { onSubmit: publishOptionsSchema },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });
}
