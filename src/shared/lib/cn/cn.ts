import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { RADIUS_TOKENS, SHADOW_TOKENS, TEXT_STYLE_TOKENS } from "./constants";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [...TEXT_STYLE_TOKENS],
      radius: [...RADIUS_TOKENS],
      shadow: [...SHADOW_TOKENS],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
