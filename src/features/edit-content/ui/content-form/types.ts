import { type ContentFormValues } from "../../model/content-input-schema";

export type ContentFormProps = {
  formId: string;
  defaultValues: ContentFormValues;
  onSubmit: (values: ContentFormValues) => void;
  isPending: boolean;
  requestError?: string;
  onValuesChange?: (values: ContentFormValues) => void;
};

export type ValuesWatcherProps = {
  values: ContentFormValues;
  onChange?: (values: ContentFormValues) => void;
};
