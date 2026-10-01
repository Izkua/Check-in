/** Short unique id for locally created records. Supabase will assign real ids later. */
export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
