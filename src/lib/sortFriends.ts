import type { Friend, SortMode } from '../types';
import { getDueDate } from './checkInState';

/** Returns a new, filtered and sorted list. Search matches the friend's name. */
export function sortAndFilterFriends(
  friends: Friend[],
  mode: SortMode,
  query: string,
): Friend[] {
  const q = query.trim().toLowerCase();
  const list = q ? friends.filter((f) => f.name.toLowerCase().includes(q)) : [...friends];

  const due = (f: Friend) => getDueDate(f.lastContactedAt, f.frequency).getTime();
  switch (mode) {
    case 'mostOverdue':
      return list.sort((a, b) => due(a) - due(b)); // earliest due date first
    case 'leastOverdue':
      return list.sort((a, b) => due(b) - due(a));
    case 'alphabetical':
      return list.sort((a, b) => a.name.localeCompare(b.name));
  }
}
