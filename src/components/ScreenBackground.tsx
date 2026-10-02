import React from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Page background plus safe-area padding. The default is the grass texture
 * (designs/Background.jpg) laid softly over the Primary color, so changing Primary
 * recolors it. An uploaded photo is shown as-is.
 */
export function ScreenBackground({ children, style, ...rest }: ViewProps) {
  const insets = useSafeAreaInsets();
  const { palette, backgroundUri } = useTheme();
  return (
    <View style={[styles.fill, { backgroundColor: palette.primary }]}>
      <Image
        source={backgroundUri ? { uri: backgroundUri } : require('../../assets/images/background.jpg')}
        style={[StyleSheet.absoluteFill, { opacity: backgroundUri ? 1 : 0.5 }]}
        resizeMode="cover"
      />
      <View
        {...rest}
        style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }, style]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
