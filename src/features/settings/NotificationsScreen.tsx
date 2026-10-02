import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { Checkbox } from '../../components/Checkbox';
import { SettingsCard } from '../../components/SettingsCard';
import { useI18n } from '../../i18n/I18nProvider';
import type { TranslationKey } from '../../i18n/translations';
import { toggleAfter } from '../../lib/notificationPlan';
import { useTheme } from '../../theme/ThemeProvider';
import { PermissionStatus, getPermission } from '../notifications/scheduler';
import { useSettings } from './SettingsProvider';
import type { AfterReminder, BeforeReminders, EmailPrefs } from './settingsTypes';

const BEFORE: { key: keyof BeforeReminders; label: TranslationKey }[] = [
  { key: 'twoWeeks', label: 'notif.twoWeeks' },
  { key: 'oneWeek', label: 'notif.oneWeek' },
  { key: 'oneDay', label: 'notif.oneDay' },
  { key: 'dayOf', label: 'notif.dayOf' },
];
const AFTER: { key: Exclude<AfterReminder, 'none'>; label: TranslationKey }[] = [
  { key: 'daily', label: 'notif.afterDaily' },
  { key: 'everyOtherDay', label: 'notif.afterEveryOtherDay' },
  { key: 'weekly', label: 'notif.afterWeekly' },
];
const EMAIL: { key: keyof EmailPrefs; label: TranslationKey }[] = [
  { key: 'appUpdates', label: 'notif.emailAppUpdate' },
  { key: 'promotions', label: 'notif.emailPromotions' },
  { key: 'communitySurvey', label: 'notif.emailSurvey' },
];

/** Notifications page (Notifs.JPG) plus the "after the check-in date" options. */
export function NotificationsScreen() {
  const { t } = useI18n();
  const { palette } = useTheme();
  const { notifications: prefs, setNotifications } = useSettings();
  const [permission, setPermission] = useState<PermissionStatus>('granted');

  useEffect(() => { getPermission().then(setPermission).catch(() => {}); }, []);

  return (
    <SettingsCard title={t('notif.title')}>
      {permission === 'denied' && (
        <AppText style={[styles.warning, { color: palette.important }]}>{t('notif.permissionDenied')}</AppText>
      )}

      <Section title={t('notif.notifyCheckIn')}>
        {BEFORE.map(({ key, label }) => (
          <Checkbox
            key={key}
            label={t(label)}
            checked={prefs.before[key]}
            onToggle={() => setNotifications({ ...prefs, before: { ...prefs.before, [key]: !prefs.before[key] } })}
          />
        ))}
      </Section>

      <Section title={t('notif.afterTitle')}>
        {AFTER.map(({ key, label }) => (
          <Checkbox
            key={key}
            label={t(label)}
            checked={prefs.after === key}
            onToggle={() => setNotifications({ ...prefs, after: toggleAfter(prefs.after, key) })}
          />
        ))}
      </Section>

      <Section title={t('notif.emailTitle')}>
        {EMAIL.map(({ key, label }) => (
          <Checkbox
            key={key}
            label={t(label)}
            checked={prefs.email[key]}
            onToggle={() => setNotifications({ ...prefs, email: { ...prefs.email, [key]: !prefs.email[key] } })}
          />
        ))}
      </Section>
    </SettingsCard>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { palette } = useTheme();
  return (
    <View style={styles.section}>
      <AppText style={[styles.sectionTitle, { color: palette.secondary }]}>{title}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 30, marginBottom: 4 },
  warning: { fontSize: 20, textAlign: 'center', marginBottom: 4 },
});
