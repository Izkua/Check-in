import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatrickHand_400Regular, useFonts } from '@expo-google-fonts/patrick-hand';
import { FriendsProvider } from '../src/features/friends/FriendsProvider';
import { NotificationSync } from '../src/features/notifications/NotificationSync';
import { SettingsProvider, useSettings } from '../src/features/settings/SettingsProvider';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

/** Root: app-wide providers. Every screen is a headerless Stack page. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <I18nProvider>
            <FriendsProvider>
              <Gate />
            </FriendsProvider>
          </I18nProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Keeps the splash screen up until the font and the saved theme/settings are loaded. */
function Gate() {
  const [fontsLoaded] = useFonts({ PatrickHand_400Regular });
  const themeReady = useTheme().ready;
  const settingsReady = useSettings().ready;
  const ready = fontsLoaded && themeReady && settingsReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      <NotificationSync />
    </>
  );
}
