import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { ScreenBackground } from './ScreenBackground';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';

/** Temporary body for pages that are built in later phases. */
export function ComingSoon({ title }: { title: string }) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <ScreenBackground>
      <View style={styles.header}><BackButton /></View>
      <View style={styles.center}>
        <AppText style={[styles.title, { color: palette.accent }]}>{title}</AppText>
        <AppText style={[styles.sub, { color: palette.card }]}>{t('common.comingSoon')}</AppText>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 40 },
  sub: { fontSize: 22, marginTop: 8 },
});
