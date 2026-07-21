export function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function endOfDayUTC(date: Date) {
  return new Date(startOfDayUTC(date).getTime() + 24 * 60 * 60 * 1000);
}

export function startOfWeekUTC(date: Date) {
  const start = startOfDayUTC(date);
  const dayOfWeek = (start.getUTCDay() + 6) % 7; // lunes = 0
  return new Date(start.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
}

export function endOfWeekUTC(date: Date) {
  return new Date(startOfWeekUTC(date).getTime() + 7 * 24 * 60 * 60 * 1000);
}
