import type { AnimalId, Friend, Note } from '../types';

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

/** DEV ONLY sample data covering all four health states. */
export function buildSampleFriends(): Friend[] {
  const mk = (
    id: string, name: string, animal: AnimalId, ago: number, days: number, weeks = 0,
    tags: string[] = [], notes: Note[] = [],
  ): Friend => ({
    id, name, animal, lastContactedAt: daysAgo(ago),
    frequency: { years: 0, months: 0, weeks, days }, tags, notes,
  });
  const note = (id: string, text: string, tags: string[], ago: number): Note =>
    ({ id, text, tags, createdAt: daysAgo(ago) });

  return [
    mk('1', 'Mia', 'cat', 2, 0, 2, ['Food', 'Gift ideas', 'Family'], [
      note('n1', 'Loves spicy ramen and the little dumpling place on 5th. Allergic to shellfish!', ['Food'], 9),
      note('n2', 'Birthday is in March. Thinking of a ceramic mug set or a plant.', ['Gift ideas'], 5),
      note('n3', 'Her sister Lily just started college. Ask how it is going.', ['Family'], 1),
    ]),
    mk('2', 'Jun', 'dog', 12, 0, 2),
    mk('3', 'Sofía', 'bunny', 15, 0, 2),
    mk('4', 'Wei', 'fox', 40, 0, 2),
    mk('5', 'Ben', 'tiger', 5, 30),
    mk('6', 'Hana', 'bird', 28, 30),
    mk('7', 'Leo', 'monkey', 70, 30),
    mk('8', 'Ana', 'fish', 20, 0, 4),
  ];
}
