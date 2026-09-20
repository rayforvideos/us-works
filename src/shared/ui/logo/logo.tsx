import { useId } from "react";

import { cn } from "@/shared/lib/cn";

import { logoClass } from "./logo-variants";
import { type LogoProps } from "./types";

export function Logo({ size = 134, className, ...rest }: LogoProps) {
  const gradientId = useId();

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 134 134"
      className={cn(logoClass(), className)}
      {...rest}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="134"
          y2="134"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00D063" />
          <stop offset="1" stopColor="#00AA8B" />
        </linearGradient>
      </defs>
      <rect width={134} height={134} rx={30} fill={`url(#${gradientId})`} />
      <text x={67} y={88} textAnchor="middle" fontSize={64} fontWeight={800} fill="#fff">
        US
      </text>
    </svg>
  );
}
