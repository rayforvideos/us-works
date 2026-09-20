import { type ReactNode } from "react";
import { type Select as BaseSelect } from "@base-ui/react/select";

export type SelectItem = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectProps = Pick<
  BaseSelect.Root.Props<string>,
  "value" | "defaultValue" | "onValueChange" | "disabled" | "name" | "required"
> & {
  items: readonly SelectItem[];
  placeholder?: ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
};
