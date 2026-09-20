import { type IconProps } from "./types";

export function CheckIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M2.2 8.4 6.1 12 13.8 4.1" />
    </svg>
  );
}
