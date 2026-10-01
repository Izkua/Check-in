import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashPressable } from '../../components/FlashPressable';
import { useI18n } from '../../i18n/I18nProvider';
import type { TranslationKey } from '../../i18n/translations';
import { useTheme } from '../../theme/ThemeProvider';

type Item = { icon: React.ComponentProps<typeof Ionicons>['name']; label: TranslationKey; route: string };

const ITEMS: Item[] = [
  { icon: 'color-palette-outline', label: 'a11y.colors', route: '/colors' },
  { icon: 'musical-notes-outline', label: 'a11y.sound', route: '/sound' },
  { icon: 'notifications-outline', label: 'a11y.notifications', route: '/notifications' },
  { icon: 'person-outline', label: 'a11y.profile', route: '/profile' },
];

interface Props {
  onNavigate: (route: string) => void;
  onClose: () => void;
  top: number;
}

/** The vertical pill the menu button turns into (Dashboard2.JPG). Tap outside to close. */
export function MenuPill({ onNavigate, onClose, top }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('a11y.menu')} />
      <View style={[styles.pill, { top, backgroundColor: palette.accent }]}>
        {ITEMS.map((item) => (
          <FlashPressable
            key={item.route}
            color={palette.accent}
            onPress={() => onNavigate(item.route)}
            accessibilityLabel={t(item.label)}
            style={styles.item}
          >
            <Ionicons name={item.icon} size={28} color={palette.secondary} />
          </FlashPressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute', right: 20, width: 56, borderRadius: 28, paddingVertical: 6,
    alignItems: 'center', zIndex: 30,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  item: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginVertical: 2 },
});
