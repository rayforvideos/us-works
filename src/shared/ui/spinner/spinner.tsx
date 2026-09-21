import { cn } from "@/shared/lib/cn";

import { spinnerClass } from "./spinner-variants";

/**
 * @types
 */
type SpinnerProps = {
  size?: number;
  className?: string;
  "aria-label"?: string;
};

/**
 * @constants
 */
const BAR_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7];

export function Spinner({
  size = 16,
  className,
  "aria-label": ariaLabel = "로딩 중",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      data-size={size}
      className={cn(spinnerClass(), className)}
    >
      <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
        {BAR_INDEXES.map((index) => (
          <rect
            key={index}
            x="7.33"
            y="1"
            width="1.33"
            height="4"
            rx="0.67"
            transform={`rotate(${index * 45} 8 8)`}
            opacity={1 - index * 0.1}
          />
        ))}
      </svg>
    </span>
  );
}
