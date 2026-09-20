import { type PublishOptionsValues } from "../../model/publish-options-schema";
import { type PublishOptionsForm } from "../../model/usePublishOptionsForm";

export type NotifySectionProps = {
  form: PublishOptionsForm;
  values: PublishOptionsValues;
  contentTitle: string;
  submitting: boolean;
  isSent: boolean;
};
