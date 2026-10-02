import type { TranslationKey } from '../i18n/translations';
import type { AfterReminder, NotificationPrefs } from '../features/settings/settingsTypes';
import type { Friend } from '../types';
import { getDueDate, isFrequencyEmpty } from './checkInState';

export type ReminderKind = 'twoWeeks' | 'oneWeek' | 'oneDay' | 'dayOf' | 'after';

export interface PlannedReminder {
  /** Stable id so rescheduling replaces rather than duplicates. */
  id: string;
  friendId: string;
  friendName: string;
  kind: ReminderKind;
  at: Date;
}

/** Reminders arrive at 9:00 in the morning, local time. */
export const REMINDER_HOUR = 9;
/** iOS keeps at most 64 pending local notifications; stay under that. */
export const MAX_SCHEDULED = 60;
/** How many repeat reminders to line up per friend after the due date. */
export const MAX_AFTER_PER_FRIEND = 8;

const AFTER_STEP_DAYS: Record<Exclude<AfterReminder, 'none'>, number> = {
  daily: 1, everyOtherDay: 2, weekly: 7,
};

function reminderTimeOn(day: Date, offsetDays: number): Date {
  const d = new Date(day.getTime());
  d.setDate(d.getDate() + offsetDays);
  d.setHours(REMINDER_HOUR, 0, 0, 0);
  return d;
}

/**
 * Works out which local notifications should exist right now, soonest first.
 * Skips anything in the past or before the last check-in, and caps the total.
 */
export function planReminders(
  friends: Friend[],
  prefs: NotificationPrefs,
  now: Date = new Date(),
  limit: number = MAX_SCHEDULED,
): PlannedReminder[] {
  const planned: PlannedReminder[] = [];

  for (const f of friends) {
    if (isFrequencyEmpty(f.frequency)) continue;
    const due = getDueDate(f.lastContactedAt, f.frequency);
    const last = new Date(f.lastContactedAt);

    const add = (kind: ReminderKind, offsetDays: number) => {
      const at = reminderTimeOn(due, offsetDays);
      if (at > now && at > last) {
        planned.push({ id: `${f.id}:${kind}:${offsetDays}`, friendId: f.id, friendName: f.name, kind, at });
      }
    };

    if (prefs.before.twoWeeks) add('twoWeeks', -14);
    if (prefs.before.oneWeek) add('oneWeek', -7);
    if (prefs.before.oneDay) add('oneDay', -1);
    if (prefs.before.dayOf) add('dayOf', 0);
    if (prefs.after !== 'none') {
      const step = AFTER_STEP_DAYS[prefs.after];
      for (let i = 1; i <= MAX_AFTER_PER_FRIEND; i++) add('after', step * i);
    }
  }

  return planned.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, limit);
}

const BODY_KEY: Record<ReminderKind, TranslationKey> = {
  twoWeeks: 'notif.body.twoWeeks',
  oneWeek: 'notif.body.oneWeek',
  oneDay: 'notif.body.oneDay',
  dayOf: 'notif.body.dayOf',
  after: 'notif.body.after',
};

export function reminderText(r: PlannedReminder, t: (k: TranslationKey) => string) {
  return {
    title: t('notif.reminderTitle').replace('{name}', r.friendName),
    body: t(BODY_KEY[r.kind]),
  };
}

/** Choosing the selected "after" option again turns it off; choosing another switches to it. */
export function toggleAfter(current: AfterReminder, choice: Exclude<AfterReminder, 'none'>): AfterReminder {
  return current === choice ? 'none' : choice;
}
