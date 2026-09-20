import { type ReactNode } from "react";

export type ListHeaderTab = {
  label: string;
  to: string;
  end?: boolean;
};

export type ListHeaderProps = {
  tabs: readonly ListHeaderTab[];
  action?: ReactNode;
};
