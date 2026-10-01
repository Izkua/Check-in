import React from 'react';
import { ImageBackground, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

/** Default page background (designs/Background.jpg) plus safe-area padding. */
export function ScreenBackground({ children, style, ...rest }: ViewProps) {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();
  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={[styles.fill, { backgroundColor: palette.primary }]}
      resizeMode="cover"
    >
      <View
        {...rest}
        style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }, style]}
      >
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
