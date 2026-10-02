import * as Notifications from 'expo-notifications';
import type { TranslationKey } from '../../i18n/translations';
import { PlannedReminder, reminderText } from '../../lib/notificationPlan';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export async function getPermission(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/** Asks iOS for permission the first time (shows the system prompt); never asks twice. */
export async function ensurePermission(): Promise<PermissionStatus> {
  const current = await getPermission();
  if (current !== 'undetermined') return current;
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

/** Replaces every scheduled reminder with the given plan. */
export async function applyPlan(plan: PlannedReminder[], t: (k: TranslationKey) => string): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const r of plan) {
    const { title, body } = reminderText(r, t);
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: { title, body, data: { friendId: r.friendId } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.at },
    });
  }
}

export async function clearAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
