import React, { createContext, useContext, useMemo } from 'react';
import { usePersistedJson } from '../../lib/usePersistedJson';
import { DEFAULT_SETTINGS, NotificationPrefs, SettingsState, SoundSettings } from './settingsTypes';

interface SettingsValue {
  sound: SoundSettings;
  setSound: (patch: Partial<SoundSettings>) => void;
  notifications: NotificationPrefs;
  setNotifications: (next: NotificationPrefs) => void;
  ready: boolean;
}

const SettingsContext = createContext<SettingsValue | null>(null);

/** Fills in anything missing so settings added in later versions get defaults. */
const revive = (raw: unknown): SettingsState => {
  const r = (raw ?? {}) as Partial<SettingsState>;
  const n = r.notifications;
  return {
    sound: { ...DEFAULT_SETTINGS.sound, ...r.sound },
    notifications: {
      before: { ...DEFAULT_SETTINGS.notifications.before, ...n?.before },
      after: n?.after ?? DEFAULT_SETTINGS.notifications.after,
      email: { ...DEFAULT_SETTINGS.notifications.email, ...n?.email },
    },
  };
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, ready] = usePersistedJson<SettingsState>('checkin.settings.v1', DEFAULT_SETTINGS, revive);

  const value = useMemo<SettingsValue>(
    () => ({
      sound: state.sound,
      setSound: (patch) => setState((s) => ({ ...s, sound: { ...s.sound, ...patch } })),
      notifications: state.notifications,
      setNotifications: (notifications) => setState((s) => ({ ...s, notifications })),
      ready,
    }),
    [state, setState, ready],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
