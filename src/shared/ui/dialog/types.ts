import { type ReactNode, type RefObject } from "react";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  disableOutsideClick?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  finalFocus?: RefObject<HTMLElement | null>;
};
