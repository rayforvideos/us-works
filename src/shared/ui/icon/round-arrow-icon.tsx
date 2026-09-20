import { type IconProps } from "./types";

export function RoundArrowIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="m8 10 4 4 4-4"
        className="stroke-blue-green-90"
        strokeWidth={1.33}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
