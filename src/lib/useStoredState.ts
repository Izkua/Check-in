import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/** useState that remembers its value on the device (e.g. dashboard layout, sort). */
export function useStoredState<T extends string>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    AsyncStorage.getItem(key).then((v) => { if (v) setValue(v as T); }).catch(() => {});
  }, [key]);

  const set = useCallback((next: T) => {
    setValue(next);
    AsyncStorage.setItem(key, next).catch(() => {});
  }, [key]);

  return [value, set] as const;
}
