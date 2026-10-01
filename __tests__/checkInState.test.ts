import { addFrequency, daysUntilDue, getHealthState } from '../src/lib/checkInState';
import { sortAndFilterFriends } from '../src/lib/sortFriends';
import type { Friend, Frequency } from '../src/types';

const twoWeeks: Frequency = { years: 0, months: 0, weeks: 2, days: 0 };
const last = '2026-01-01T00:00:00.000Z';
const at = (days: number) => new Date(new Date(last).getTime() + days * 86_400_000);

describe('getHealthState (14 day interval)', () => {
  it('is happy while more than 10% of the time is left', () => {
    expect(getHealthState(last, twoWeeks, at(0))).toBe('happy');
    expect(getHealthState(last, twoWeeks, at(12))).toBe('happy');
  });
  it('is tired in the last 10% before the due date', () => {
    expect(getHealthState(last, twoWeeks, at(13))).toBe('tired');
  });
  it('is sick from the due date until 10% past it', () => {
    expect(getHealthState(last, twoWeeks, at(14))).toBe('sick');
    expect(getHealthState(last, twoWeeks, at(15))).toBe('sick');
  });
  it('is very sick once more than 10% past due', () => {
    expect(getHealthState(last, twoWeeks, at(16))).toBe('verySick');
  });
  it('treats an empty frequency as happy', () => {
    expect(getHealthState(last, { years: 0, months: 0, weeks: 0, days: 0 }, at(100))).toBe('happy');
  });
});

describe('addFrequency', () => {
  it('adds years, months, weeks and days', () => {
    const d = addFrequency(new Date(2026, 0, 31), { years: 1, months: 1, weeks: 1, days: 1 });
    expect(d.getFullYear()).toBe(2027);
  });
  it('daysUntilDue is negative when overdue', () => {
    expect(daysUntilDue(last, twoWeeks, at(20))).toBeLessThan(0);
  });
});

describe('sortAndFilterFriends', () => {
  const mk = (id: string, name: string, ago: number): Friend => ({
    id, name, animal: 'cat', frequency: twoWeeks, tags: [], notes: [],
    lastContactedAt: new Date(Date.now() - ago * 86_400_000).toISOString(),
  });
  const friends = [mk('a', 'Zed', 1), mk('b', 'Amy', 30), mk('c', 'Max', 10)];

  it('defaults to most overdue first', () => {
    expect(sortAndFilterFriends(friends, 'mostOverdue', '').map((f) => f.id)).toEqual(['b', 'c', 'a']);
  });
  it('reverses for least overdue', () => {
    expect(sortAndFilterFriends(friends, 'leastOverdue', '').map((f) => f.id)).toEqual(['a', 'c', 'b']);
  });
  it('sorts alphabetically', () => {
    expect(sortAndFilterFriends(friends, 'alphabetical', '').map((f) => f.name)).toEqual(['Amy', 'Max', 'Zed']);
  });
  it('filters by name, case-insensitively', () => {
    expect(sortAndFilterFriends(friends, 'alphabetical', 'ma').map((f) => f.name)).toEqual(['Max']);
  });
});
