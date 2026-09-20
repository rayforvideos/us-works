import { type ContentCategory } from "@/entities/content";

export type CategoryFieldProps = {
  value: ContentCategory[];
  onChange: (value: ContentCategory[]) => void;
  error?: string;
  disabled?: boolean;
};
