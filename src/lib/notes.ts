import type { Note, NoteSort } from '../types';
import { newId } from './id';

export const MAX_TAG_LENGTH = 20;

/** Trims a user-typed tag; returns null when it is empty. */
export function normalizeTag(raw: string): string | null {
  const tag = raw.trim().replace(/\s+/g, ' ').slice(0, MAX_TAG_LENGTH);
  return tag.length > 0 ? tag : null;
}

/** Adds a tag to a list unless an equal one (ignoring case) is already there. */
export function addTag(tags: string[], raw: string): string[] {
  const tag = normalizeTag(raw);
  if (!tag) return tags;
  const exists = tags.some((t) => t.toLowerCase() === tag.toLowerCase());
  return exists ? tags : [...tags, tag];
}

export function createNote(text: string, tags: string[], now: Date = new Date()): Note {
  return { id: newId(), text: text.trim(), tags, createdAt: now.toISOString() };
}

/** Replaces the note with the same id, keeping its original creation date. */
export function updateNote(notes: Note[], id: string, text: string, tags: string[]): Note[] {
  return notes.map((n) => (n.id === id ? { ...n, text: text.trim(), tags } : n));
}

export function removeNote(notes: Note[], id: string): Note[] {
  return notes.filter((n) => n.id !== id);
}

export interface NoteQuery {
  query: string;
  tags: string[]; // a note matches if it has ANY selected tag; empty = no tag filter
  sort: NoteSort;
}

/** Search matches note text and tag names. Returns a new, sorted list. */
export function filterAndSortNotes(notes: Note[], { query, tags, sort }: NoteQuery): Note[] {
  const q = query.trim().toLowerCase();
  const result = notes.filter((n) => {
    const matchesText =
      q.length === 0 ||
      n.text.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q));
    const matchesTags = tags.length === 0 || n.tags.some((t) => tags.includes(t));
    return matchesText && matchesTags;
  });
  const dir = sort === 'newest' ? -1 : 1;
  return result.sort((a, b) => dir * (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
}
