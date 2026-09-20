import { type IconProps } from "./types";

export function PlusIcon({ size = 16, ...rest }: IconProps) {
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
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}
