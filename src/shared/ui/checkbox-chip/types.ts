import { type ComponentPropsWithRef, type ReactNode } from "react";

type CheckboxChipShape = "solid" | "outlined";

export type CheckboxChipProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "size"
> & {
  shape?: CheckboxChipShape;
  children: ReactNode;
};
