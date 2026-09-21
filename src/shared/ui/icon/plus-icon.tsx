import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function PlusIcon({ size = 16, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 16 16" strokeWidth={2}>
      <path d="M8 2.5v11M2.5 8h11" />
    </StrokeIcon>
  );
}
