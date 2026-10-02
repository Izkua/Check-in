import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { SettingsCard } from '../../components/SettingsCard';
import { Slider } from '../../components/Slider';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../theme/ThemeProvider';
import { useSettings } from './SettingsProvider';

/**
 * Sound Setting page (Sound.JPG): music and sound-effect volume. The levels are saved
 * and exposed through useSettings().sound, ready for when the audio files are added.
 */
export function SoundScreen() {
  const { t } = useI18n();
  const { palette } = useTheme();
  const { sound, setSound } = useSettings();

  return (
    <SettingsCard title={t('sound.title')}>
      <View style={styles.block}>
        <AppText style={[styles.label, { color: palette.cardText }]}>{t('sound.music')}</AppText>
        <Slider value={sound.music} onChange={(music) => setSound({ music })} label={t('sound.music')} color={palette.secondary} />
      </View>
      <View style={styles.block}>
        <AppText style={[styles.label, { color: palette.cardText }]}>{t('sound.effects')}</AppText>
        <Slider value={sound.effects} onChange={(effects) => setSound({ effects })} label={t('sound.effects')} color={palette.secondary} />
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 40 },
  label: { fontSize: 30, textAlign: 'center', marginBottom: 6 },
});
