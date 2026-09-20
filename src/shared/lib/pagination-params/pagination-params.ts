export function getPageCount(total: number, limit: number): number {
  if (limit <= 0) {
    return 1;
  }
  return Math.max(Math.ceil(total / limit), 1);
}

export function parsePage(raw: string | null, max: number): number {
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }
  return Math.min(page, max);
}
