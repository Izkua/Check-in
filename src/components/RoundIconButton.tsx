import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashPressable } from './FlashPressable';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string; // accessibility label
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** The peach circular buttons from the designs (add friend, menu, back, ...). */
export function RoundIconButton({ icon, label, onPress, size = 52, style }: Props) {
  const { palette } = useTheme();
  return (
    <FlashPressable
      color={palette.accent}
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <Ionicons name={icon} size={size * 0.5} color={palette.secondary} />
    </FlashPressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
