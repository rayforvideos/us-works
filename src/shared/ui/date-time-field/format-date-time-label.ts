/**
 * @constants
 */
const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

export function formatDateTimeLabel(value: string): string {
  const matched = DATE_TIME_PATTERN.exec(value);
  if (matched === null) {
    return "";
  }
  const [, year, month, day, hour, minute] = matched;

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
}
