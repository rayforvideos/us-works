import { toSeoulParts } from "@/shared/lib/seoul-time";

import { SCHEDULED_AT_MINUTE_PATTERN, SEOUL_OFFSET, STEP_MINUTES } from "./constants";

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

export function toMinDateTime(now: Date): string {
  return toSeoulDateTime(now);
}

export function isFutureScheduledAt(local: string, now: Date): boolean {
  const scheduled = new Date(toScheduledAt(local));
  if (Number.isNaN(scheduled.getTime())) {
    return false;
  }
  return scheduled.getTime() > now.getTime();
}

export function isHalfHourStep(local: string): boolean {
  const matched = SCHEDULED_AT_MINUTE_PATTERN.exec(local);
  if (matched === null) {
    return false;
  }
  return Number(matched[1]) % STEP_MINUTES === 0;
}
