import type { AnimalId, Frequency } from '../types';
import { isFrequencyEmpty } from './checkInState';

export const MAX_NAME_LENGTH = 30;

/** Wheel limits from the designs (Create.JPG). */
export const FREQUENCY_MAX: Record<keyof Frequency, number> = {
  years: 10, months: 11, weeks: 5, days: 30,
};

export const EMPTY_FREQUENCY: Frequency = { years: 0, months: 0, weeks: 0, days: 0 };

export interface FriendDraft {
  name: string;
  animal: AnimalId;
  frequency: Frequency;
}

export type DraftError = 'name' | 'frequency';

/** Returns the first problem with a new friend, or null when it can be saved. */
export function validateDraft(d: FriendDraft): DraftError | null {
  if (d.name.trim().length === 0) return 'name';
  if (isFrequencyEmpty(d.frequency)) return 'frequency';
  return null;
}
