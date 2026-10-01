import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../theme/ThemeProvider';

/** Warm message for a brand-new user, or when search finds nothing. */
export function EmptyState({ searching }: { searching: boolean }) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <View style={styles.wrap}>
      <AppText style={styles.emoji}>{searching ? '🔍' : '🐾'}</AppText>
      <AppText style={[styles.title, { color: palette.card }]}>
        {searching ? t('dashboard.noResults') : t('dashboard.emptyTitle')}
      </AppText>
      {!searching && <AppText style={[styles.body, { color: palette.card }]}>{t('dashboard.emptyBody')}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  emoji: { fontSize: 64 },
  title: { fontSize: 28, marginTop: 8, textAlign: 'center' },
  body: { fontSize: 20, marginTop: 6, textAlign: 'center' },
});
