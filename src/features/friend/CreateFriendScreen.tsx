import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/AppText';
import { BackButton } from '../../components/BackButton';
import { FlashPressable } from '../../components/FlashPressable';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useI18n } from '../../i18n/I18nProvider';
import { DraftError, EMPTY_FREQUENCY, FriendDraft, validateDraft } from '../../lib/friendDraft';
import { useTheme } from '../../theme/ThemeProvider';
import { useFriends } from '../friends/FriendsProvider';
import { FrequencyCard } from './FrequencyCard';
import { FriendHeader } from './FriendHeader';
import { IconPicker } from './IconPicker';

/** Create a new friend (Create.JPG): pick an animal, type a name, set the check-in frequency. */
export function CreateFriendScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { palette } = useTheme();
  const { addFriend } = useFriends();

  const [draft, setDraft] = useState<FriendDraft>({ name: '', animal: 'cat', frequency: EMPTY_FREQUENCY });
  const [pickingIcon, setPickingIcon] = useState(false);
  const [error, setError] = useState<DraftError | null>(null);

  if (pickingIcon) {
    return (
      <IconPicker
        current={draft.animal}
        onBack={() => setPickingIcon(false)}
        onSelect={(animal) => { setDraft((d) => ({ ...d, animal })); setPickingIcon(false); }}
      />
    );
  }

  const create = () => {
    const problem = validateDraft(draft);
    setError(problem);
    if (problem) return;
    addFriend(draft);
    router.canGoBack() ? router.back() : router.replace('/');
  };

  const errorText = error === 'name' ? t('friend.errorName') : error === 'frequency' ? t('friend.errorFrequency') : null;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          <BackButton />
          <FriendHeader
            animal={draft.animal}
            state="happy"
            name={draft.name}
            onChangeAnimal={() => setPickingIcon(true)}
            onChangeName={(name) => { setDraft((d) => ({ ...d, name })); if (error === 'name') setError(null); }}
          />
          <FrequencyCard
            alwaysOpen
            title={t('freq.createTitle')}
            value={draft.frequency}
            onChange={(frequency) => { setDraft((d) => ({ ...d, frequency })); if (error === 'frequency') setError(null); }}
          />
          {errorText && <AppText style={[styles.error, { color: palette.important }]}>{errorText}</AppText>}
          <FlashPressable color={palette.secondary} onPress={create} style={styles.create}>
            <AppText style={styles.createText}>{t('friend.create')}</AppText>
          </FlashPressable>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48, alignItems: 'center' },
  column: { width: '100%', maxWidth: 640, gap: 16 },
  error: { fontSize: 22, textAlign: 'center', backgroundColor: 'rgba(253,239,219,0.9)', borderRadius: 16, paddingVertical: 6 },
  create: { borderRadius: 26, paddingVertical: 12, alignItems: 'center' },
  createText: { color: '#fff', fontSize: 28 },
});
