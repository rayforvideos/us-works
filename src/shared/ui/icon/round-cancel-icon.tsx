import { type IconProps } from "./types";

export function RoundCancelIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5"
        className="stroke-white"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
