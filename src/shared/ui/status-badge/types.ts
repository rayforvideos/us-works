import { type ComponentPropsWithRef, type ReactNode } from "react";

type StatusBadgeTone = "green" | "red" | "yellow" | "grey";

export type StatusBadgeProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  tone: StatusBadgeTone;
  showDot?: boolean;
  children: ReactNode;
};
