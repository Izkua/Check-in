import type { AnimalId, HealthState } from '../types';

/** Free starter animals. Shop collections will add more later. */
export const STARTER_ANIMALS: AnimalId[] = [
  'dog', 'cat', 'bunny', 'bird', 'tiger', 'fish', 'fox', 'monkey', 'chicken',
];

/** Placeholder art: swap for real illustrations via ANIMAL_ART below. */
export const PLACEHOLDER_EMOJI: Record<AnimalId, string> = {
  dog: '🐶', cat: '🐱', bunny: '🐰', bird: '🐦', tiger: '🐯',
  fish: '🐟', fox: '🦊', monkey: '🐵', chicken: '🐔',
};

export const STATE_BADGE: Record<HealthState, string | null> = {
  happy: null, tired: '💤', sick: '🤒', verySick: '🤢',
};

/**
 * When the custom artwork arrives, add entries here, e.g.
 *   ANIMAL_ART.cat = { happy: require('../../assets/animals/cat/happy.png'), ... }
 * AnimalAvatar uses the image when present and the emoji placeholder otherwise.
 */
export const ANIMAL_ART: Partial<Record<AnimalId, Partial<Record<HealthState, number>>>> = {};
