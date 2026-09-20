import { type ComponentPropsWithRef } from "react";

export type IconProps = Omit<ComponentPropsWithRef<"svg">, "width" | "height" | "viewBox"> & {
  size?: number;
};
