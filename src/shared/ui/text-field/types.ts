import { type ComponentPropsWithRef, type ReactNode } from "react";

type TextFieldType = "text" | "email" | "password";

export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "type" | "size"> & {
  type?: TextFieldType;
  clearable?: boolean;
  showCounter?: boolean;
  error?: ReactNode;
  onClear?: () => void;
};
