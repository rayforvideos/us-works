import { StrokeIcon } from "./stroke-icon";
import { type IconProps } from "./types";

export function ArrowLeftIcon({ size = 24, ...rest }: IconProps) {
  return (
    <StrokeIcon {...rest} size={size} viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </StrokeIcon>
  );
}
