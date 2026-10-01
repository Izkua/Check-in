import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AnimalAvatar } from '../../components/AnimalAvatar';
import { AppText } from '../../components/AppText';
import { useI18n } from '../../i18n/I18nProvider';
import { MAX_NAME_LENGTH } from '../../lib/friendDraft';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import type { AnimalId, HealthState } from '../../types';

interface Props {
  animal: AnimalId;
  state: HealthState;
  name: string;
  onChangeAnimal: () => void; // opens the icon gallery
  onChangeName: (name: string) => void;
  /** Optional line under the name, e.g. "Last check-in: Oct 1, 2026". */
  subtitle?: string;
  /** Start with the name field focused (new friend). */
  autoFocusName?: boolean;
}

/** Animal icon + name at the top of the Create and Friend screens. Both are tap-to-edit. */
export function FriendHeader({ animal, state, name, onChangeAnimal, onChangeName, subtitle, autoFocusName }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const [editing, setEditing] = useState(!!autoFocusName);
  const [text, setText] = useState(name);
  const bounce = useRef(new Animated.Value(1)).current;

  useEffect(() => { if (!editing) setText(name); }, [name, editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = text.trim();
    if (trimmed.length > 0) onChangeName(trimmed);
    else setText(name); // empty input: keep the old name
  };

  const pressIcon = () => {
    Animated.sequence([
      Animated.spring(bounce, { toValue: 1.15, speed: 40, bounciness: 14, useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, speed: 24, bounciness: 14, useNativeDriver: true }),
    ]).start();
    onChangeAnimal();
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={pressIcon}
        accessibilityRole="button"
        accessibilityLabel={t('friend.changeIcon')}
        style={[styles.iconCard, { backgroundColor: palette.card }]}
      >
        <Animated.View style={{ transform: [{ scale: bounce }] }}>
          <AnimalAvatar animal={animal} state={state} size={120} />
        </Animated.View>
      </Pressable>

      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          onBlur={commit}
          onSubmitEditing={commit}
          autoFocus
          maxLength={MAX_NAME_LENGTH}
          returnKeyType="done"
          placeholder={t('friend.namePlaceholder')}
          placeholderTextColor={palette.secondary}
          style={[styles.nameInput, { color: palette.cardText, backgroundColor: palette.card, fontFamily: FONT_FAMILY }]}
        />
      ) : (
        <Pressable onPress={() => setEditing(true)} accessibilityRole="button" accessibilityLabel={t('friend.editName')}>
          <AppText style={[styles.name, { color: name ? palette.card : palette.accent }]}>
            {name || t('friend.namePlaceholder')}
          </AppText>
        </Pressable>
      )}
      {subtitle ? <AppText style={[styles.subtitle, { color: palette.card }]}>{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  iconCard: { borderRadius: 32, padding: 16 },
  name: {
    fontSize: 40, marginTop: 10, textAlign: 'center',
    textShadowColor: 'rgba(63,122,43,0.45)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3,
  },
  nameInput: { fontSize: 36, marginTop: 10, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 6, minWidth: 200, textAlign: 'center' },
  subtitle: { fontSize: 20, marginTop: 2 },
});
