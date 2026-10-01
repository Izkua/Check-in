import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AnimalAvatar } from '../../components/AnimalAvatar';
import { AppText } from '../../components/AppText';
import { RoundIconButton } from '../../components/RoundIconButton';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useI18n } from '../../i18n/I18nProvider';
import { STARTER_ANIMALS } from '../../lib/animals';
import { useTheme } from '../../theme/ThemeProvider';
import type { AnimalId, HealthState } from '../../types';

interface Props {
  current: AnimalId;
  onSelect: (animal: AnimalId) => void;
  onBack: () => void;
  /** Health state used to preview the animals (current friend's state, happy for a new one). */
  state?: HealthState;
}

/** Full-screen animal gallery (Icon_options.JPG): current animal on top, scrollable options below. */
export function IconPicker({ current, onSelect, onBack, state = 'happy' }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const cols = width >= 700 ? 5 : 3;
  const tile = Math.min(150, Math.floor((Math.min(width, 900) - 40 - 12 * (cols - 1)) / cols));

  return (
    <ScreenBackground>
      <View style={styles.back}>
        <RoundIconButton icon="arrow-undo-outline" label={t('a11y.back')} onPress={onBack} size={44} />
      </View>
      <View style={styles.currentWrap}>
        <View style={[styles.currentCard, { backgroundColor: palette.card }]}>
          <AnimalAvatar animal={current} state={state} size={110} />
          <AppText style={[styles.currentName, { color: palette.cardText }]}>{t(`animal.${current}`)}</AppText>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.grid, { gap: 12 }]} showsVerticalScrollIndicator={false}>
        {STARTER_ANIMALS.map((a) => (
          <Pressable
            key={a}
            onPress={() => onSelect(a)}
            accessibilityRole="button"
            accessibilityLabel={t(`animal.${a}`)}
            accessibilityState={{ selected: a === current }}
            style={({ pressed }) => [
              styles.tile,
              {
                width: tile,
                backgroundColor: pressed ? palette.accent : palette.card,
                borderColor: a === current ? palette.secondary : 'transparent',
              },
            ]}
          >
            <AnimalAvatar animal={a} state={state} size={tile * 0.55} />
            <AppText numberOfLines={1} style={[styles.tileName, { color: palette.cardText }]}>{t(`animal.${a}`)}</AppText>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  back: { paddingHorizontal: 20, paddingTop: 12 },
  currentWrap: { alignItems: 'center', marginTop: 4 },
  currentCard: { borderRadius: 28, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center' },
  currentName: { fontSize: 24, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 20, paddingBottom: 40 },
  tile: { borderRadius: 24, paddingVertical: 12, alignItems: 'center', borderWidth: 3 },
  tileName: { fontSize: 20, marginTop: 4 },
});
