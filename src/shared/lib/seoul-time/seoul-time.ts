import { SEOUL_TIME_FORMAT_OPTIONS } from "./constants";
import { type SeoulParts } from "./types";

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function toSeoulParts(date: Date): SeoulParts | null {
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("ko-KR", SEOUL_TIME_FORMAT_OPTIONS).formatToParts(date);

  return {
    year: readPart(parts, "year"),
    month: readPart(parts, "month"),
    day: readPart(parts, "day"),
    hour: readPart(parts, "hour"),
    minute: readPart(parts, "minute"),
  };
}
