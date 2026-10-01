import { addTag, createNote, filterAndSortNotes, normalizeTag, removeNote, updateNote } from '../src/lib/notes';
import { formatFrequency } from '../src/lib/formatFrequency';
import { validateDraft } from '../src/lib/friendDraft';
import { TRANSLATIONS } from '../src/i18n/translations';
import type { Note } from '../src/types';

const note = (id: string, text: string, tags: string[], day: number): Note =>
  ({ id, text, tags, createdAt: new Date(2026, 0, day).toISOString() });

describe('tags', () => {
  it('trims and rejects empty tags', () => {
    expect(normalizeTag('  Food   ideas ')).toBe('Food ideas');
    expect(normalizeTag('   ')).toBeNull();
  });
  it('does not add duplicates, ignoring case', () => {
    expect(addTag(['Food'], 'food')).toEqual(['Food']);
    expect(addTag(['Food'], 'Gifts')).toEqual(['Food', 'Gifts']);
  });
});

describe('note editing', () => {
  it('creates, edits (keeping the date) and removes notes', () => {
    const n = createNote('  hello ', ['a']);
    expect(n.text).toBe('hello');
    const edited = updateNote([n], n.id, 'bye', ['b']);
    expect(edited[0]).toMatchObject({ text: 'bye', tags: ['b'], createdAt: n.createdAt });
    expect(removeNote(edited, n.id)).toEqual([]);
  });
});

describe('filterAndSortNotes', () => {
  const notes = [
    note('1', 'Likes ramen', ['Food'], 1),
    note('2', 'Birthday in March', ['Gifts'], 2),
    note('3', 'Sister at college', ['Family', 'Food'], 3),
  ];
  const base = { query: '', tags: [] as string[], sort: 'newest' as const };

  it('sorts newest and oldest first', () => {
    expect(filterAndSortNotes(notes, base).map((n) => n.id)).toEqual(['3', '2', '1']);
    expect(filterAndSortNotes(notes, { ...base, sort: 'oldest' }).map((n) => n.id)).toEqual(['1', '2', '3']);
  });
  it('searches note text and tag names', () => {
    expect(filterAndSortNotes(notes, { ...base, query: 'RAMEN' }).map((n) => n.id)).toEqual(['1']);
    expect(filterAndSortNotes(notes, { ...base, query: 'gift' }).map((n) => n.id)).toEqual(['2']);
  });
  it('filters by any selected tag', () => {
    expect(filterAndSortNotes(notes, { ...base, tags: ['Food'] }).map((n) => n.id)).toEqual(['3', '1']);
    expect(filterAndSortNotes(notes, { ...base, tags: ['Food', 'Gifts'] })).toHaveLength(3);
  });
  it('combines search and tag filter', () => {
    expect(filterAndSortNotes(notes, { ...base, query: 'sister', tags: ['Gifts'] })).toEqual([]);
  });
});

describe('validateDraft', () => {
  const ok = { name: 'Mia', animal: 'cat' as const, frequency: { years: 0, months: 0, weeks: 2, days: 0 } };
  it('accepts a named friend with a frequency', () => expect(validateDraft(ok)).toBeNull());
  it('requires a name', () => expect(validateDraft({ ...ok, name: '  ' })).toBe('name'));
  it('requires a non-zero frequency', () =>
    expect(validateDraft({ ...ok, frequency: { years: 0, months: 0, weeks: 0, days: 0 } })).toBe('frequency'));
});

describe('formatFrequency', () => {
  const t = (k: keyof typeof TRANSLATIONS.en) => TRANSLATIONS.en[k];
  it('skips zero units and pluralizes', () => {
    expect(formatFrequency({ years: 1, months: 0, weeks: 2, days: 1 }, t)).toBe('1 year 2 weeks 1 day');
  });
});

describe('translations', () => {
  it('every language defines every key', () => {
    const keys = Object.keys(TRANSLATIONS.en);
    for (const lang of ['es', 'zh', 'ko'] as const) {
      expect(Object.keys(TRANSLATIONS[lang]).sort()).toEqual([...keys].sort());
    }
  });
});
