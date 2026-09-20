import { useId } from "react";

import { type IconProps } from "./types";

export function LogoIcon({ size = 22, ...rest }: IconProps) {
  const gradientId = useId();

  return (
    <svg
      aria-hidden
      width={size}
      height={(size * 14) / 22}
      viewBox="0 0 22 14"
      fill="none"
      {...rest}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="22"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00D063" />
          <stop offset="1" stopColor="#00AA8B" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="13"
        rx="5.33"
        fill="none"
        stroke="#01AE87"
        strokeWidth="0.67"
      />
      <text
        x={11}
        y={10.2}
        textAnchor="middle"
        fontSize={9}
        fontWeight={800}
        fontFamily="inherit"
        fill={`url(#${gradientId})`}
      >
        US
      </text>
    </svg>
  );
}
