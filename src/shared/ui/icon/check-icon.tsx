import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function CheckIcon({ size = 16, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 16 16" strokeWidth={2}>
      <path d="M2.2 8.4 6.1 12 13.8 4.1" />
    </StrokeIcon>
  );
}
