import type { Friend } from '../types';

/**
 * Storage boundary for friend records. Screens only talk to this interface,
 * so the local (guest) implementation can be swapped for Supabase after login
 * without touching any UI.
 */
export interface FriendsRepository {
  list(): Promise<Friend[]>;
  save(friends: Friend[]): Promise<void>;
}
