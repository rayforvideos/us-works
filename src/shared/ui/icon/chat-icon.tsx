import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function ChatIcon({ size = 24, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </StrokeIcon>
  );
}
