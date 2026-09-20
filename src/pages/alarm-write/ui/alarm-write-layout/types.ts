import { type ReactNode } from "react";

export type AlarmWriteLayoutProps = {
  isDirty: boolean;
  actions?: ReactNode;
  children: ReactNode;
};
