import { type ComponentPropsWithRef } from "react";

export type CheckboxSize = "medium" | "large";

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "size"> & {
  size?: CheckboxSize;
};
