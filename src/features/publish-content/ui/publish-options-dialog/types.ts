import { type RefObject } from "react";

import { type Content } from "@/entities/content";
import { type Notification } from "@/entities/notification";

import { type PublishOptionsValues } from "../../model/publish-options-schema";

export type PublishOptionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: Content | null;
  notification: Notification | null;
  contentTitle: string;
  submitting: boolean;
  requestError?: string;
  finalFocus?: RefObject<HTMLElement | null>;
  onSubmit: (values: PublishOptionsValues) => void;
};
