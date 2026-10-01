import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Friend } from '../types';
import type { FriendsRepository } from './friendsRepository';
import { buildSampleFriends } from './sampleFriends';

const KEY = 'checkin.friends.v2';
const SEEDED_KEY = 'checkin.seeded.v2';

/** Guest-mode storage: friends live on the device only. */
export const localFriendsRepository: FriendsRepository = {
  async list() {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return (JSON.parse(raw) as Friend[]).map(normalize);

    // DEV ONLY: seed sample friends once so the dashboard has something to show
    // until the Create Friend screen exists. Remove with the sample file.
    if (__DEV__ && !(await AsyncStorage.getItem(SEEDED_KEY))) {
      const sample = buildSampleFriends();
      await AsyncStorage.multiSet([[KEY, JSON.stringify(sample)], [SEEDED_KEY, '1']]);
      return sample;
    }
    return [];
  },
  async save(friends) {
    await AsyncStorage.setItem(KEY, JSON.stringify(friends));
  },
};

/** Older saved records may lack newer fields; fill them in. */
function normalize(f: Friend): Friend {
  return { ...f, tags: f.tags ?? [], notes: f.notes ?? [] };
}
