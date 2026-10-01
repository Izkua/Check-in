import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/AppText';
import { WheelColumn } from '../../components/WheelPicker';
import { useI18n } from '../../i18n/I18nProvider';
import { isFrequencyEmpty } from '../../lib/checkInState';
import { FREQUENCY_MAX } from '../../lib/friendDraft';
import { formatFrequency, unitLabel } from '../../lib/formatFrequency';
import { useTheme } from '../../theme/ThemeProvider';
import type { Frequency } from '../../types';

const UNITS: (keyof Frequency)[] = ['years', 'months', 'weeks', 'days'];

interface Props {
  value: Frequency;
  onChange: (f: Frequency) => void;
  title: string;
  /** Create screen: wheel always open and an empty (all 0) value is allowed while editing. */
  alwaysOpen?: boolean;
}

/**
 * "Frequency:" panel. On the Friend screen it is collapsed to a summary line
 * (Person.JPG); tap the header to open the wheel (Edit_frequency.JPG) and tap again to close.
 * On the Friend screen an all-zero value is never saved.
 */
export function FrequencyCard({ value, onChange, title, alwaysOpen = false }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const [open, setOpen] = useState(alwaysOpen);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const handle = (unit: keyof Frequency, n: number) => {
    const next = { ...draft, [unit]: n };
    setDraft(next);
    if (alwaysOpen || !isFrequencyEmpty(next)) onChange(next);
  };

  const invalid = !alwaysOpen && isFrequencyEmpty(draft);
  const toggle = () => {
    if (alwaysOpen) return;
    if (open && invalid) setDraft(value); // closing with an invalid wheel restores the saved value
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <Pressable
        onPress={toggle}
        disabled={alwaysOpen}
        accessibilityRole="button"
        accessibilityLabel={t('freq.toggle')}
        style={styles.header}
      >
        <AppText style={[styles.title, { color: palette.accent }]}>
          {title}
          {!alwaysOpen && !open ? <AppText style={{ color: palette.cardText }}>{'  '}{formatFrequency(value, t)}</AppText> : null}
        </AppText>
        {!alwaysOpen && <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={24} color={palette.secondary} />}
      </Pressable>

      {open && (
        <View style={styles.wheels}>
          {UNITS.map((unit) => (
            <WheelColumn
              key={unit}
              max={FREQUENCY_MAX[unit]}
              value={draft[unit]}
              label={unitLabel(unit, draft[unit], t)}
              onChange={(n) => handle(unit, n)}
            />
          ))}
        </View>
      )}
      {open && invalid && <AppText style={[styles.hint, { color: palette.important }]}>{t('freq.minimum')}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 },
  title: { fontSize: 28, flexShrink: 1 },
  wheels: { flexDirection: 'row', marginTop: 8 },
  hint: { fontSize: 18, textAlign: 'center', marginTop: 4 },
});
