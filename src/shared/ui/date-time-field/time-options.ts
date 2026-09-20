/**
 * @constants
 */
const STEP_MINUTES = 30;

const MINUTES_PER_DAY = 24 * 60;

const TIME_PATTERN = /^\d{2}:\d{2}$/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function buildTimeOptions(currentTime: string): string[] {
  const options: string[] = [];
  for (let minutes = 0; minutes < MINUTES_PER_DAY; minutes += STEP_MINUTES) {
    options.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
  }
  if (TIME_PATTERN.test(currentTime) && !options.includes(currentTime)) {
    options.unshift(currentTime);
  }

  return options;
}
