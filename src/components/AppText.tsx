import React from 'react';
import { Text, TextProps } from 'react-native';
import { FONT_FAMILY } from '../theme/fonts';

/** Text with the app's cute font applied. Use this instead of react-native's Text. */
export function AppText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[{ fontFamily: FONT_FAMILY }, style]} />;
}
