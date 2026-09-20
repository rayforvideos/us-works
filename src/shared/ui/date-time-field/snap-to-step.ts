/**
 * @constants
 */
const LOCAL_DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/;

const MINUTES_PER_DAY = 24 * 60;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function snapToStep(local: string, stepSeconds: number): string {
  const match = LOCAL_DATE_TIME_PATTERN.exec(local);
  const stepMinutes = stepSeconds / 60;
  if (match === null || stepMinutes < 1 || !Number.isInteger(stepMinutes)) {
    return local;
  }
  const date = match[1] ?? "";
  const minutesOfDay = Number(match[2]) * 60 + Number(match[3]);
  const snapped = Math.min(
    Math.round(minutesOfDay / stepMinutes) * stepMinutes,
    MINUTES_PER_DAY - stepMinutes,
  );
  return `${date}T${pad(Math.floor(snapped / 60))}:${pad(snapped % 60)}`;
}
