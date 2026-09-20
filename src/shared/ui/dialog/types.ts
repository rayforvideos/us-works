import { type ReactNode, type RefObject } from "react";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  finalFocus?: RefObject<HTMLElement | null>;
};
