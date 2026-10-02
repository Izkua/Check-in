import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useI18n } from '../../i18n/I18nProvider';
import { planReminders } from '../../lib/notificationPlan';
import { useFriends } from '../friends/FriendsProvider';
import { useSettings } from '../settings/SettingsProvider';
import { applyPlan, clearAll, ensurePermission } from './scheduler';

// Show reminders as a banner even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Invisible component mounted once at the app root. It
 *  1. keeps the scheduled local reminders in step with friends and notification settings, and
 *  2. opens the right friend when the user taps a reminder.
 */
export function NotificationSync() {
  const router = useRouter();
  const { friends, loading } = useFriends();
  const { notifications, ready } = useSettings();
  const { t, language } = useI18n();

  // Run syncs one at a time so two quick changes can't interleave.
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (loading || !ready) return;
    queue.current = queue.current.then(async () => {
      try {
        const plan = planReminders(friends, notifications);
        if (plan.length === 0) return clearAll();
        const permission = await ensurePermission();
        if (permission !== 'granted') return clearAll();
        await applyPlan(plan, t);
      } catch { /* scheduling is best-effort; try again on the next change */ }
    });
    // `t` changes with the language, so reminders are rewritten in the new language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friends, notifications, loading, ready, language]);

  // Tapping a reminder (also when it launched the app) opens that friend.
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!response) return;
    const requestId = response.notification.request.identifier;
    if (handled.current === requestId) return;
    handled.current = requestId;
    const friendId = response.notification.request.content.data?.friendId;
    if (typeof friendId === 'string') {
      setTimeout(() => router.push({ pathname: '/friend/[id]', params: { id: friendId } }), 0);
    }
  }, [response, router]);

  return null;
}
