/** When to remind about a check-in that is coming up. */
export interface BeforeReminders {
  twoWeeks: boolean;
  oneWeek: boolean;
  oneDay: boolean;
  dayOf: boolean;
}

/** How often to keep reminding once the check-in date has passed. */
export type AfterReminder = 'none' | 'daily' | 'everyOtherDay' | 'weekly';

/** Email topics. Saved now; sending needs the backend. */
export interface EmailPrefs {
  appUpdates: boolean;
  promotions: boolean;
  communitySurvey: boolean;
}

export interface NotificationPrefs {
  before: BeforeReminders;
  after: AfterReminder;
  email: EmailPrefs;
}

export interface SoundSettings {
  music: number;   // 0..1
  effects: number; // 0..1
}

export interface SettingsState {
  sound: SoundSettings;
  notifications: NotificationPrefs;
}

export const DEFAULT_SETTINGS: SettingsState = {
  sound: { music: 0.7, effects: 0.7 },
  notifications: {
    before: { twoWeeks: false, oneWeek: false, oneDay: true, dayOf: true },
    after: 'weekly',
    email: { appUpdates: false, promotions: false, communitySurvey: false },
  },
};
