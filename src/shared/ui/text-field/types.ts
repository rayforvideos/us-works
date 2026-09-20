import { type ComponentPropsWithRef, type ReactNode } from "react";

export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "type" | "size"> & {
  clearable?: boolean;
  showCounter?: boolean;
  error?: ReactNode;
  onClear?: () => void;
};
