import { type PublishOptionsForm } from "../../../model/usePublishOptionsForm";

export type NotifySectionProps = {
  form: PublishOptionsForm;
  contentTitle: string;
  submitting: boolean;
  isSent: boolean;
};
