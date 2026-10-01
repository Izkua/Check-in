import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ANIMAL_ART, PLACEHOLDER_EMOJI, STATE_BADGE } from '../lib/animals';
import type { AnimalId, HealthState } from '../types';
import { AppText } from './AppText';

interface Props {
  animal: AnimalId;
  state: HealthState;
  size: number;
}

/**
 * Shows one animal in one health state. Uses real artwork from ANIMAL_ART when it
 * exists and an emoji placeholder otherwise, so artwork can be dropped in later
 * without changing any screen.
 */
export function AnimalAvatar({ animal, state, size }: Props) {
  const art = ANIMAL_ART[animal]?.[state];
  const badge = STATE_BADGE[state];
  const dim = state === 'sick' ? 0.8 : state === 'verySick' ? 0.6 : 1;

  return (
    <View style={{ width: size, height: size }}>
      {art ? (
        <Image source={art} style={{ width: size, height: size }} resizeMode="contain" />
      ) : (
        <View style={[styles.center, { width: size, height: size, opacity: dim }]}>
          <AppText style={{ fontSize: size * 0.72 }}>{PLACEHOLDER_EMOJI[animal]}</AppText>
        </View>
      )}
      {badge && !art && (
        <AppText style={[styles.badge, { fontSize: size * 0.3 }]}>{badge}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2 },
});
