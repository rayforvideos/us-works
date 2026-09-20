import { type ContentFormValues } from "../../model/content-input-schema";

export type ContentFormProps = {
  formId: string;
  defaultValues: ContentFormValues;
  onSubmit: (values: ContentFormValues) => void;
  isPending: boolean;
  onValuesChange?: (values: ContentFormValues) => void;
};
