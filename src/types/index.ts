/** Shared domain types. Mirrors the Supabase tables added in the backend phase. */

export type AnimalId =
  | 'dog' | 'cat' | 'bunny' | 'bird' | 'tiger'
  | 'fish' | 'fox' | 'monkey' | 'chicken';

/** How overdue a check-in is. Drives which artwork an animal shows. */
export type HealthState = 'happy' | 'tired' | 'sick' | 'verySick';

/** Custom check-in interval, set with the wheel picker (Timer.PNG). */
export interface Frequency {
  years: number;   // 0-10
  months: number;  // 0-11
  weeks: number;   // 0-5
  days: number;    // 0-30
}

export interface Note {
  id: string;
  text: string;
  tags: string[];
  createdAt: string; // ISO
}

export interface Friend {
  id: string;
  name: string;
  animal: AnimalId;
  lastContactedAt: string; // ISO
  frequency: Frequency;
  /** Tags the user has created for this friend's notes (kept even if no note uses them yet). */
  tags: string[];
  notes: Note[];
}

export type SortMode = 'mostOverdue' | 'leastOverdue' | 'alphabetical';

/** Dashboard layout: columns x rows visible on a phone (2x3, 3x4, 4x5). */
export type DashboardLayout = '2x3' | '3x4' | '4x5';

export type NoteSort = 'newest' | 'oldest';
