import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function ChevronLeftIcon({ size = 16, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 16 16" strokeWidth={1.5}>
      <path d="m10 3-5 5 5 5" />
    </StrokeIcon>
  );
}
