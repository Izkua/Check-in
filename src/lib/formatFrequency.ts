import type { TranslationKey } from '../i18n/translations';
import type { Frequency } from '../types';

type Unit = keyof Frequency;

const SINGULAR: Record<Unit, TranslationKey> = {
  years: 'unit.year', months: 'unit.month', weeks: 'unit.week', days: 'unit.day',
};
const PLURAL: Record<Unit, TranslationKey> = {
  years: 'unit.years', months: 'unit.months', weeks: 'unit.weeks', days: 'unit.days',
};

/** "3 weeks", "1 year 2 months"... Units that are 0 are skipped. */
export function formatFrequency(f: Frequency, t: (k: TranslationKey) => string): string {
  const order: Unit[] = ['years', 'months', 'weeks', 'days'];
  return order
    .filter((u) => f[u] > 0)
    .map((u) => `${f[u]} ${t(f[u] === 1 ? SINGULAR[u] : PLURAL[u])}`)
    .join(' ');
}

/** Label shown beside a wheel column: "1 year" uses the singular. */
export function unitLabel(unit: Unit, value: number, t: (k: TranslationKey) => string): string {
  return t(value === 1 ? SINGULAR[unit] : PLURAL[unit]);
}
