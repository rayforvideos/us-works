import { type ReactNode } from "react";

import { type NotificationFormValues } from "../../model/notification-input-schema";

export type NotificationFormProps = {
  formId: string;
  defaultValues: NotificationFormValues;
  onSubmit: (values: NotificationFormValues) => void;
  disabled: boolean;
  requestError?: string;
  onValuesChange?: (values: NotificationFormValues) => void;
};

export type SectionLabelProps = {
  label: ReactNode;
  error?: string;
  errorId?: string;
};
