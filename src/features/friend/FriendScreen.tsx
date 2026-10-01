import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText } from '../../components/AppText';
import { BackButton } from '../../components/BackButton';
import { FlashPressable } from '../../components/FlashPressable';
import { ScreenBackground } from '../../components/ScreenBackground';
import { Skeleton } from '../../components/Skeleton';
import { useI18n } from '../../i18n/I18nProvider';
import { getHealthState } from '../../lib/checkInState';
import { useTheme } from '../../theme/ThemeProvider';
import { useFriends } from '../friends/FriendsProvider';
import { FrequencyCard } from './FrequencyCard';
import { FriendHeader } from './FriendHeader';
import { IconPicker } from './IconPicker';
import { NotesPanel } from './NotesPanel';

/**
 * A friend's page (Person.JPG). Everything edits in place: tap the animal to change it,
 * tap the name to rename, tap Frequency to open the wheel, and manage extra notes below.
 * Changes are saved as you make them.
 */
export function FriendScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, formatDate } = useI18n();
  const { palette } = useTheme();
  const { friends, loading, updateFriend, logCheckIn } = useFriends();
  const [pickingIcon, setPickingIcon] = useState(false);

  const friend = friends.find((f) => f.id === id);

  if (loading) return <FriendSkeleton />;

  if (!friend) {
    return (
      <ScreenBackground>
        <View style={styles.pad}><BackButton /></View>
        <View style={styles.center}>
          <AppText style={[styles.notFound, { color: palette.card }]}>{t('friend.notFound')}</AppText>
        </View>
      </ScreenBackground>
    );
  }

  const state = getHealthState(friend.lastContactedAt, friend.frequency);

  if (pickingIcon) {
    return (
      <IconPicker
        current={friend.animal}
        state={state}
        onBack={() => setPickingIcon(false)}
        onSelect={(animal) => { updateFriend(friend.id, { animal }); setPickingIcon(false); }}
      />
    );
  }

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
            animal={friend.animal}
            state={state}
            name={friend.name}
            subtitle={`${t('dashboard.lastCheckIn')}: ${formatDate(friend.lastContactedAt)}`}
            onChangeAnimal={() => setPickingIcon(true)}
            onChangeName={(name) => updateFriend(friend.id, { name })}
          />
          <FlashPressable color={palette.secondary} onPress={() => logCheckIn(friend.id)} style={styles.logButton}>
            <AppText style={styles.logText}>{t('friend.logCheckIn')}</AppText>
          </FlashPressable>
          <FrequencyCard
            title={t('freq.title')}
            value={friend.frequency}
            onChange={(frequency) => updateFriend(friend.id, { frequency })}
          />
          <NotesPanel
            notes={friend.notes}
            tags={friend.tags}
            onChange={(patch) => updateFriend(friend.id, patch)}
          />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

/** Shown while friends load (e.g. when opened from a notification). */
function FriendSkeleton() {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        <View style={[styles.column, { alignItems: 'center' }]}>
          <Skeleton style={{ width: 152, height: 152, borderRadius: 32 }} />
          <Skeleton style={{ width: 180, height: 40 }} />
          <Skeleton style={{ width: '100%', height: 72, borderRadius: 28 }} />
          <Skeleton style={{ width: '100%', height: 260, borderRadius: 28 }} />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 28 },
  content: { padding: 20, paddingBottom: 48, alignItems: 'center' },
  column: { width: '100%', maxWidth: 640, gap: 16 },
  logButton: { borderRadius: 24, paddingVertical: 10, alignItems: 'center', alignSelf: 'center', paddingHorizontal: 32 },
  logText: { color: '#fff', fontSize: 24 },
});
