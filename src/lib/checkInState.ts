import type { Frequency, HealthState } from '../types';

/** Fraction of the interval that counts as "approaching" and "significantly overdue". */
export const WARNING_FRACTION = 0.1;

/** Adds a calendar-aware frequency to a date (months/years respect month length). */
export function addFrequency(from: Date, f: Frequency): Date {
  const d = new Date(from.getTime());
  d.setFullYear(d.getFullYear() + f.years);
  d.setMonth(d.getMonth() + f.months);
  d.setDate(d.getDate() + f.weeks * 7 + f.days);
  return d;
}

export function isFrequencyEmpty(f: Frequency): boolean {
  return f.years + f.months + f.weeks + f.days === 0;
}

export function getDueDate(lastContactedAt: string, f: Frequency): Date {
  return addFrequency(new Date(lastContactedAt), f);
}

/**
 * happy     : more than 10% of the interval left
 * tired     : last 10% before the due date
 * sick      : from the due date until 10% of the interval past it
 * verySick  : more than 10% of the interval past due
 */
export function getHealthState(
  lastContactedAt: string,
  f: Frequency,
  now: Date = new Date(),
): HealthState {
  if (isFrequencyEmpty(f)) return 'happy';
  const last = new Date(lastContactedAt).getTime();
  const due = addFrequency(new Date(last), f).getTime();
  const interval = due - last;
  const remaining = due - now.getTime();

  if (remaining > interval * WARNING_FRACTION) return 'happy';
  if (remaining > 0) return 'tired';
  if (-remaining < interval * WARNING_FRACTION) return 'sick';
  return 'verySick';
}

/** Whole days until due (negative = overdue). Used for display and sorting. */
export function daysUntilDue(
  lastContactedAt: string,
  f: Frequency,
  now: Date = new Date(),
): number {
  const ms = getDueDate(lastContactedAt, f).getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}
