import { type ComponentPropsWithRef, type ReactNode } from "react";

export type TextAreaProps = ComponentPropsWithRef<"textarea"> & {
  showCounter?: boolean;
  error?: ReactNode;
};
