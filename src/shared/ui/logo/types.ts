import { type ComponentPropsWithRef } from "react";

export type LogoProps = Omit<ComponentPropsWithRef<"svg">, "width" | "height" | "viewBox"> & {
  size?: number;
};
