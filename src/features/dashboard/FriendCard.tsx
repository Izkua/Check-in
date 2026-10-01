import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { AnimalAvatar } from '../../components/AnimalAvatar';
import { AppText } from '../../components/AppText';
import { useI18n } from '../../i18n/I18nProvider';
import { getHealthState } from '../../lib/checkInState';
import { useTheme } from '../../theme/ThemeProvider';
import { darken } from '../../theme/colors';
import type { Friend } from '../../types';

interface Props {
  friend: Friend;
  width: number;
  onPress: (friend: Friend) => void;
}

/** One friend on the dashboard: animal (reflecting current state), name, last check-in. */
export function FriendCard({ friend, width, onPress }: Props) {
  const { palette } = useTheme();
  const { t, formatDate } = useI18n();
  const bounce = useRef(new Animated.Value(1)).current;

  const state = getHealthState(friend.lastContactedAt, friend.frequency);
  const handlePress = () => {
    // Friendly micro-animation: the animal bounces, then we open the profile.
    Animated.sequence([
      Animated.spring(bounce, { toValue: 1.22, speed: 40, bounciness: 14, useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, speed: 24, bounciness: 14, useNativeDriver: true }),
    ]).start();
    setTimeout(() => onPress(friend), 160);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={friend.name}
      style={({ pressed }) => [
        styles.card,
        { width, backgroundColor: pressed ? darken(palette.card, 0.08) : palette.card },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: bounce }] }}>
        <AnimalAvatar animal={friend.animal} state={state} size={width * 0.5} />
      </Animated.View>
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.name, { color: palette.cardText, fontSize: Math.max(13, width * 0.15) }]}
      >
        {friend.name}
      </AppText>
      <AppText
        numberOfLines={2}
        style={[styles.date, { color: palette.cardText, fontSize: Math.max(10, width * 0.085) }]}
      >
        {t('dashboard.lastCheckIn')}: {friend.lastContactedAt ? formatDate(friend.lastContactedAt) : t('dashboard.never')}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  name: { marginTop: 6, textAlign: 'center', maxWidth: '100%' },
  date: { textAlign: 'center', opacity: 0.85 },
});
