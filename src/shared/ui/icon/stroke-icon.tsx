import { type ReactNode } from "react";

import { type IconProps } from "./types";

/**
 * @types
 */
type StrokeIconProps = Omit<IconProps, "strokeWidth"> & {
  viewBox: string;
  strokeWidth: number;
  children: ReactNode;
};

export function StrokeIcon({ size, viewBox, strokeWidth, children, ...rest }: StrokeIconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}
