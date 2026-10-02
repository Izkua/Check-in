import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { Slider } from '../../components/Slider';
import { useI18n } from '../../i18n/I18nProvider';
import { Hsv, hexToHsv, hsvToHex, normalizeHex } from '../../lib/color';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const PRESETS = [
  '#A4D484', '#8CC46C', '#5B8C5A', '#FCE0B8', '#FFC9B8', '#F9998D', '#E53935', '#FFD6E8',
  '#E8C5F2', '#BFD8FF', '#A8E6E0', '#FFF3A8', '#7A5C3E', '#9AA5B1', '#333333', '#FFFFFF',
];

const RAINBOW = Array.from({ length: 24 }, (_, i) => hsvToHex({ h: i * 15, s: 1, v: 1 }));

interface Props {
  visible: boolean;
  title: string;
  initialColor: string;
  onCancel: () => void;
  onApply: (hex: string) => void;
}

/** Pick a color with preset swatches, hue/saturation/brightness sliders, or a hex code. */
export function ColorPickerDialog({ visible, title, initialColor, onCancel, onApply }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const [hsv, setHsv] = useState<Hsv>(hexToHsv(initialColor));
  const [hexText, setHexText] = useState(initialColor);

  // Start from the current color every time the dialog opens.
  useEffect(() => {
    if (visible) {
      setHsv(hexToHsv(initialColor));
      setHexText(initialColor);
    }
  }, [visible, initialColor]);

  const hex = hsvToHex(hsv);
  const setFromHsv = (next: Hsv) => { setHsv(next); setHexText(hsvToHex(next)); };
  const setFromHex = (h: string) => { setHsv(hexToHsv(h)); setHexText(h); };

  const onHexInput = (text: string) => {
    setHexText(text);
    const valid = normalizeHex(text);
    if (valid) setHsv(hexToHsv(valid));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.card, { backgroundColor: palette.card }]} onPress={() => {}}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <AppText style={[styles.title, { color: palette.secondary }]}>{title}</AppText>

            <View style={styles.previewRow}>
              <View style={[styles.preview, { backgroundColor: hex, borderColor: palette.cardText }]} />
              <TextInput
                value={hexText}
                onChangeText={onHexInput}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={7}
                accessibilityLabel={t('colors.hex')}
                style={[styles.hexInput, { color: palette.cardText, borderColor: palette.accent, fontFamily: FONT_FAMILY }]}
              />
            </View>

            <View style={styles.presets}>
              {PRESETS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setFromHex(c)}
                  accessibilityRole="button"
                  accessibilityLabel={c}
                  style={[styles.swatch, { backgroundColor: c, borderColor: c === hex ? palette.cardText : palette.accent }]}
                />
              ))}
            </View>

            <AppText style={[styles.sliderLabel, { color: palette.cardText }]}>{t('colors.hue')}</AppText>
            <Slider
              value={hsv.h / 360}
              onChange={(v) => setFromHsv({ ...hsv, h: v * 360 })}
              label={t('colors.hue')}
              color={palette.cardText}
              track={<View style={styles.rainbow}>{RAINBOW.map((c) => <View key={c} style={{ flex: 1, backgroundColor: c }} />)}</View>}
            />
            <AppText style={[styles.sliderLabel, { color: palette.cardText }]}>{t('colors.saturation')}</AppText>
            <Slider value={hsv.s} onChange={(v) => setFromHsv({ ...hsv, s: v })} label={t('colors.saturation')} color={palette.cardText} />
            <AppText style={[styles.sliderLabel, { color: palette.cardText }]}>{t('colors.brightness')}</AppText>
            <Slider value={hsv.v} onChange={(v) => setFromHsv({ ...hsv, v })} label={t('colors.brightness')} color={palette.cardText} />

            <View style={styles.buttons}>
              <FlashPressable color={palette.accent} onPress={onCancel} style={styles.button}>
                <AppText style={[styles.buttonText, { color: palette.cardText }]}>{t('notes.cancel')}</AppText>
              </FlashPressable>
              <FlashPressable color={palette.secondary} onPress={() => onApply(hex)} style={styles.button}>
                <AppText style={[styles.buttonText, { color: palette.onSecondary }]}>{t('colors.apply')}</AppText>
              </FlashPressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, maxHeight: '90%', borderRadius: 32, padding: 20 },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 12 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  preview: { width: 64, height: 64, borderRadius: 20, borderWidth: 3 },
  hexInput: { flex: 1, fontSize: 26, borderWidth: 2, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 14, justifyContent: 'center' },
  swatch: { width: 40, height: 40, borderRadius: 14, borderWidth: 3 },
  sliderLabel: { fontSize: 20, marginTop: 6 },
  rainbow: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginHorizontal: 6 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1, borderRadius: 22, paddingVertical: 12, alignItems: 'center' },
  buttonText: { fontSize: 24 },
});
