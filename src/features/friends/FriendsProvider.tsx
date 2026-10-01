import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { localFriendsRepository } from '../../data/localFriendsRepository';
import type { FriendsRepository } from '../../data/friendsRepository';
import type { FriendDraft } from '../../lib/friendDraft';
import { newId } from '../../lib/id';
import type { Friend } from '../../types';

/** Fields of a friend that can be edited after creation. */
export type FriendPatch = Partial<Omit<Friend, 'id'>>;

interface FriendsValue {
  friends: Friend[];
  /** True until the first load finishes, so screens can show skeletons. */
  loading: boolean;
  addFriend: (draft: FriendDraft) => Friend;
  updateFriend: (id: string, patch: FriendPatch) => void;
  /** Sets last contact to now, which resets the animal to healthy. */
  logCheckIn: (id: string) => void;
}

const FriendsContext = createContext<FriendsValue | null>(null);

export function FriendsProvider({
  children,
  repository = localFriendsRepository,
}: {
  children: React.ReactNode;
  repository?: FriendsRepository;
}) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  // Latest list, so two quick updates in a row never overwrite each other.
  const latest = useRef<Friend[]>([]);

  useEffect(() => {
    let cancelled = false;
    repository.list().then((list) => {
      if (cancelled) return;
      latest.current = list;
      setFriends(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [repository]);

  const commit = useCallback((next: Friend[]) => {
    latest.current = next;
    setFriends(next);
    repository.save(next).catch(() => {});
  }, [repository]);

  const addFriend = useCallback((draft: FriendDraft) => {
    const friend: Friend = {
      id: newId(),
      name: draft.name.trim(),
      animal: draft.animal,
      frequency: draft.frequency,
      lastContactedAt: new Date().toISOString(),
      tags: [],
      notes: [],
    };
    commit([...latest.current, friend]);
    return friend;
  }, [commit]);

  const updateFriend = useCallback((id: string, patch: FriendPatch) => {
    commit(latest.current.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, [commit]);

  const logCheckIn = useCallback((id: string) => {
    updateFriend(id, { lastContactedAt: new Date().toISOString() });
  }, [updateFriend]);

  const value = useMemo(
    () => ({ friends, loading, addFriend, updateFriend, logCheckIn }),
    [friends, loading, addFriend, updateFriend, logCheckIn],
  );
  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}

export function useFriends(): FriendsValue {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error('useFriends must be used inside FriendsProvider');
  return ctx;
}
