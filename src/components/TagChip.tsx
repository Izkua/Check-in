import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { FlashPressable } from './FlashPressable';

interface Props {
  label: string;
  /** Selected chips are solid; unselected are the soft peach pill (Edit_add_note.JPG). */
  selected?: boolean;
  onPress?: () => void;
  small?: boolean;
}

export function TagChip({ label, selected = false, onPress, small = false }: Props) {
  const { palette } = useTheme();
  return (
    <FlashPressable
      color={selected ? palette.secondary : palette.accent}
      onPress={onPress}
      disabled={!onPress}
      accessibilityState={{ selected }}
      style={[styles.chip, small && styles.small]}
    >
      <AppText numberOfLines={1} style={[styles.text, small && styles.smallText, { color: selected ? palette.onSecondary : palette.cardText }]}>
        {label}
      </AppText>
    </FlashPressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderRadius: 18, paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'flex-start', maxWidth: '100%' },
  small: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 12 },
  text: { fontSize: 18 },
  smallText: { fontSize: 14 },
});
