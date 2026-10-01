import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { darken } from '../theme/colors';

interface Props extends Omit<PressableProps, 'style'> {
  /** Resting background color. It flashes darker while pressed. */
  color: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** Every tappable button in the app uses this so the press-flash is consistent. */
export function FlashPressable({ color, style, children, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={({ pressed }) => [style, { backgroundColor: pressed ? darken(color, 0.14) : color }]}
    >
      {children}
    </Pressable>
  );
}
