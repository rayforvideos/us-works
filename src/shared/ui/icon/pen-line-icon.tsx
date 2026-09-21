import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function PenLineIcon({ size = 24, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </StrokeIcon>
  );
}
