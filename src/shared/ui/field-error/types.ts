import { type ReactNode } from "react";

export type FieldErrorProps = {
  error?: ReactNode;
  id?: string;
  reserve?: boolean;
  className?: string;
};
