import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { ScreenBackground } from './ScreenBackground';

/** Shared shell for the settings pages: back button + big rounded cream card with a title. */
export function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { palette } = useTheme();
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.column}>
          <BackButton />
          <View style={[styles.card, { backgroundColor: palette.card }]}>
            <AppText style={[styles.title, { color: palette.secondary }]}>{title}</AppText>
            {children}
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48, alignItems: 'center' },
  column: { width: '100%', maxWidth: 560, gap: 16 },
  card: { borderRadius: 48, padding: 28 },
  title: { fontSize: 44, textAlign: 'center', marginBottom: 12 },
});
