import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function CancelIcon({ size = 24, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M6 6l12 12M18 6 6 18" />
    </StrokeIcon>
  );
}
