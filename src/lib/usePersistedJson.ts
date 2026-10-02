import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useState that is saved to the device as JSON. `revive` turns what was stored into a
 * full value (so new settings added later get defaults). `ready` is false until the
 * stored value has been read, so screens can avoid flashing defaults.
 */
export function usePersistedJson<T>(key: string, initial: T, revive: (raw: unknown) => T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const latest = useRef<T>(initial);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            latest.current = revive(JSON.parse(raw));
            setValue(latest.current);
          } catch { /* corrupt data: keep defaults */ }
        }
        setReady(true);
      })
      .catch(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(latest.current) : next;
    latest.current = resolved;
    setValue(resolved);
    AsyncStorage.setItem(key, JSON.stringify(resolved)).catch(() => {});
  }, [key]);

  return [value, update, ready] as const;
}
