import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatrickHand_400Regular, useFonts } from '@expo-google-fonts/patrick-hand';
import { FriendsProvider } from '../src/features/friends/FriendsProvider';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { ThemeProvider } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

/** Root: fonts + app-wide providers. Every screen is a headerless Stack page. */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({ PatrickHand_400Regular });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <FriendsProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
          </FriendsProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
