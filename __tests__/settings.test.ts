import { contrastRatio, hexToHsv, hsvToHex, mix, normalizeHex, readableTextOn } from '../src/lib/color';
import { MAX_AFTER_PER_FRIEND, planReminders, reminderText, toggleAfter } from '../src/lib/notificationPlan';
import { DEFAULT_SETTINGS } from '../src/features/settings/settingsTypes';
import { DEFAULT_COLORS, buildPalette } from '../src/theme/colors';
import { TRANSLATIONS } from '../src/i18n/translations';
import type { Friend } from '../src/types';

describe('color helpers', () => {
  it('normalizes hex input', () => {
    expect(normalizeHex('a4d484')).toBe('#A4D484');
    expect(normalizeHex(' #a4d484 ')).toBe('#A4D484');
    expect(normalizeHex('#abc')).toBeNull();
    expect(normalizeHex('zzzzzz')).toBeNull();
  });
  it('round-trips hex through HSV', () => {
    for (const hex of ['#A4D484', '#FCE0B8', '#E53935', '#000000', '#FFFFFF', '#336699']) {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    }
  });
  it('mix blends colors', () => {
    expect(mix('#000000', '#FFFFFF', 0.5)).toBe('#808080');
  });
  it('picks readable button text', () => {
    expect(readableTextOn('#8CC46C')).toBe('#FFFFFF'); // the default green keeps white text
    expect(readableTextOn('#FFF3A8')).not.toBe('#FFFFFF'); // very light colors get dark text
  });
});

describe('palette', () => {
  const p = buildPalette(DEFAULT_COLORS);
  it('derives a cream card from the accent', () => {
    expect(p.card).toBe('#FEF0DC'); // within a shade of the designed cream (#FFF0DB)
  });
  it('keeps card text readable on cards', () => {
    expect(contrastRatio(p.cardText, p.card)).toBeGreaterThan(4.5);
  });
});

const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86_400_000);

describe('planReminders', () => {
  // Last contact Jan 1 09:30, every 28 days -> due Jan 29.
  const friend: Friend = {
    id: 'f1', name: 'Mia', animal: 'cat', tags: [], notes: [],
    lastContactedAt: new Date('2026-01-01T09:30:00').toISOString(),
    frequency: { years: 0, months: 0, weeks: 4, days: 0 },
  };
  const now = new Date('2026-01-02T12:00:00');
  const allBefore = { twoWeeks: true, oneWeek: true, oneDay: true, dayOf: true };
  const noBefore = { twoWeeks: false, oneWeek: false, oneDay: false, dayOf: false };
  const prefs = (over: Partial<typeof DEFAULT_SETTINGS.notifications> = {}) => ({
    ...DEFAULT_SETTINGS.notifications, before: allBefore, after: 'none' as const, ...over,
  });

  it('plans before-reminders at 9:00 and day-of', () => {
    const plan = planReminders([friend], prefs(), now);
    expect(plan.map((r) => r.kind)).toEqual(['twoWeeks', 'oneWeek', 'oneDay', 'dayOf']);
    expect(plan.map((r) => r.at.getDate())).toEqual([15, 22, 28, 29]);
    expect(plan.every((r) => r.at.getHours() === 9)).toBe(true);
  });
  it('skips reminders already in the past', () => {
    const later = new Date('2026-01-20T12:00:00');
    // Jan 20: the 2-week reminder (Jan 15) has passed, but Jan 22, 28 and 29 are still ahead.
    expect(planReminders([friend], prefs(), later).map((r) => r.kind)).toEqual(['oneWeek', 'oneDay', 'dayOf']);
  });
  it('skips options that are off', () => {
    const only = prefs({ before: { ...noBefore, dayOf: true } });
    expect(planReminders([friend], only, now).map((r) => r.kind)).toEqual(['dayOf']);
  });
  it('repeats after the due date at the chosen rhythm', () => {
    const daily = planReminders([friend], prefs({ after: 'daily', before: noBefore }), now);
    expect(daily).toHaveLength(MAX_AFTER_PER_FRIEND);
    expect(daily[0].at.getDate()).toBe(30);
    const every2 = planReminders([friend], prefs({ after: 'everyOtherDay', before: noBefore }), now);
    expect(daysBetween(every2[0].at, every2[1].at)).toBe(2);
    const weekly = planReminders([friend], prefs({ after: 'weekly', before: noBefore }), now);
    expect(daysBetween(weekly[0].at, weekly[1].at)).toBe(7);
  });
  it('sorts across friends and respects the limit', () => {
    const other = { ...friend, id: 'f2', name: 'Jun', frequency: { years: 0, months: 0, weeks: 0, days: 10 } };
    const plan = planReminders([friend, other], prefs({ after: 'daily' }), now, 5);
    expect(plan).toHaveLength(5);
    const times = plan.map((r) => r.at.getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
  it('writes the friend name into the notification', () => {
    const t = (k: keyof typeof TRANSLATIONS.en) => TRANSLATIONS.en[k];
    const [first] = planReminders([friend], prefs(), now);
    expect(reminderText(first, t).title).toBe('Check in with Mia');
  });
});

describe('toggleAfter', () => {
  it('switches between options and turns off when tapped again', () => {
    expect(toggleAfter('weekly', 'daily')).toBe('daily');
    expect(toggleAfter('daily', 'daily')).toBe('none');
    expect(toggleAfter('none', 'weekly')).toBe('weekly');
  });
});
