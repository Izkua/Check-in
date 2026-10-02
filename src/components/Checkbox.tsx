import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

/** Rounded check box with a label (Notifs.JPG): ticked when applied, empty when not. */
export function Checkbox({ label, checked, onToggle }: Props) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <View style={[styles.box, { borderColor: palette.secondary, backgroundColor: checked ? palette.secondary : 'transparent' }]}>
        {checked && <Ionicons name="checkmark" size={22} color={palette.onSecondary} />}
      </View>
      <AppText style={[styles.label, { color: palette.cardText }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 },
  box: { width: 32, height: 32, borderRadius: 10, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 24, flexShrink: 1 },
});
