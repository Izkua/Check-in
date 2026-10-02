import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { SettingsCard } from '../../components/SettingsCard';
import { useI18n } from '../../i18n/I18nProvider';
import { deleteBackground, saveBackground } from '../../lib/backgroundStorage';
import { useTheme } from '../../theme/ThemeProvider';
import type { BaseColors } from '../../theme/colors';
import type { TranslationKey } from '../../i18n/translations';
import { ColorPickerDialog } from './ColorPickerDialog';

const ROWS: { key: keyof BaseColors; label: TranslationKey }[] = [
  { key: 'primary', label: 'colors.primary' },
  { key: 'secondary', label: 'colors.secondary' },
  { key: 'accent', label: 'colors.accent' },
  { key: 'important', label: 'colors.important' },
];

/** Color Palette page (Colors.JPG): change the background photo and the four theme colors. */
export function ColorsScreen() {
  const { t } = useI18n();
  const { palette, backgroundUri, backgroundFile, setColor, setBackgroundFile, resetTheme } = useTheme();
  const [editing, setEditing] = useState<keyof BaseColors | null>(null);
  const [photoError, setPhotoError] = useState(false);

  const pickBackground = async () => {
    setPhotoError(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (result.canceled) return;
      const previous = backgroundFile;
      const fileName = saveBackground(result.assets[0].uri);
      setBackgroundFile(fileName);
      deleteBackground(previous);
    } catch {
      setPhotoError(true);
    }
  };

  const revert = () => {
    deleteBackground(backgroundFile);
    resetTheme();
  };

  return (
    <SettingsCard title={t('colors.title')}>
      <View style={styles.row}>
        <AppText style={[styles.label, { color: palette.cardText }]}>{t('colors.background')}</AppText>
        <Pressable
          onPress={pickBackground}
          accessibilityRole="button"
          accessibilityLabel={t('colors.changeBackground')}
          style={[styles.preview, { borderColor: palette.secondary, backgroundColor: palette.primary }]}
        >
          <Image
            source={backgroundUri ? { uri: backgroundUri } : require('../../../assets/images/background.jpg')}
            style={[StyleSheet.absoluteFill, { opacity: backgroundUri ? 1 : 0.5 }]}
            resizeMode="cover"
          />
        </Pressable>
      </View>
      {photoError && <AppText style={[styles.error, { color: palette.important }]}>{t('colors.photoError')}</AppText>}

      {ROWS.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <AppText style={[styles.label, { color: palette.cardText }]}>{t(label)}</AppText>
          <Pressable
            onPress={() => setEditing(key)}
            accessibilityRole="button"
            accessibilityLabel={t(label)}
            style={[styles.swatch, { backgroundColor: palette[key], borderColor: palette.secondary }]}
          />
        </View>
      ))}

      <FlashPressable color="#F9998D" onPress={revert} style={styles.revert}>
        <AppText style={[styles.revertText, { color: palette.important }]}>{t('colors.revert')}</AppText>
      </FlashPressable>

      <ColorPickerDialog
        visible={editing !== null}
        title={editing ? t(`colors.${editing}`) : ''}
        initialColor={editing ? palette[editing] : '#FFFFFF'}
        onCancel={() => setEditing(null)}
        onApply={(hex) => { if (editing) setColor(editing, hex); setEditing(null); }}
      />
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  label: { fontSize: 30 },
  preview: { width: 150, height: 96, borderRadius: 18, borderWidth: 3, overflow: 'hidden' },
  swatch: { width: 56, height: 56, borderRadius: 16, borderWidth: 3 },
  error: { fontSize: 18, textAlign: 'right' },
  revert: { borderRadius: 28, paddingVertical: 12, alignItems: 'center', marginTop: 24, borderWidth: 3, borderColor: '#E53935' },
  revertText: { fontSize: 32 },
});
