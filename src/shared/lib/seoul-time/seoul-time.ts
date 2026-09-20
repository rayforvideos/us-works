import { SEOUL_OFFSET, SEOUL_TIME_FORMAT_OPTIONS } from "./constants";
import { type SeoulParts } from "./types";

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function toSeoulDateTime(date: Date): string {
  const parts = toSeoulParts(date);
  if (parts === null) {
    return "";
  }

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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

export function toSeoulIso(local: string): string {
  return `${local}:00${SEOUL_OFFSET}`;
}

export function fromSeoulIso(iso: string): string {
  return toSeoulDateTime(new Date(iso));
}

export function toMinDateTime(now: Date): string {
  return toSeoulDateTime(now);
}

export function isFutureDateTime(local: string, now: Date): boolean {
  const picked = new Date(toSeoulIso(local));
  if (Number.isNaN(picked.getTime())) {
    return false;
  }

  return picked.getTime() > now.getTime();
}
