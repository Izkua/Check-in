import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { RoundIconButton } from '../../components/RoundIconButton';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../theme/ThemeProvider';
import type { DashboardLayout } from '../../types';
import { LAYOUT_ORDER } from './gridLayout';

interface Props {
  value: DashboardLayout;
  open: boolean;
  onToggle: () => void;
  onSelect: (layout: DashboardLayout) => void;
}

/** Small layout button under the title; opens a drop-down of grid sizes. */
export function LayoutDropdown({ value, open, onToggle, onSelect }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <View style={styles.wrap}>
      <RoundIconButton icon="apps-outline" label={t('layout.change')} onPress={onToggle} size={36} />
      {open && (
        <View style={[styles.menu, { backgroundColor: palette.card }]}>
          {LAYOUT_ORDER.map((layout) => {
            const selected = layout === value;
            return (
              <FlashPressable
                key={layout}
                color={selected ? palette.accent : palette.card}
                onPress={() => onSelect(layout)}
                accessibilityState={{ selected }}
                style={styles.item}
              >
                <AppText style={[styles.itemText, { color: palette.cardText }]}>
                  {layout.replace('x', ' × ')}
                </AppText>
              </FlashPressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 20 },
  menu: {
    position: 'absolute', top: 42, left: 0, minWidth: 110, borderRadius: 18, padding: 6,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  item: { borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 },
  itemText: { fontSize: 20 },
});
