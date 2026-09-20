import { toSeoulParts } from "@/shared/lib/seoul-time";

import { SEOUL_OFFSET } from "./constants";

function toSeoulDateTime(date: Date): string {
  const parts = toSeoulParts(date);
  if (parts === null) {
    return "";
  }

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function toScheduledAt(local: string): string {
  return `${local}:00${SEOUL_OFFSET}`;
}

export function fromScheduledAt(iso: string): string {
  return toSeoulDateTime(new Date(iso));
}

export function toMinDate(now: Date): string {
  const parts = toSeoulParts(now);
  if (parts === null) {
    return "";
  }

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function isFutureScheduledAt(local: string, now: Date): boolean {
  const scheduled = new Date(toScheduledAt(local));
  if (Number.isNaN(scheduled.getTime())) {
    return false;
  }

  return scheduled.getTime() > now.getTime();
}
