import { type IconProps } from "./types";

export function ChevronRightIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}
