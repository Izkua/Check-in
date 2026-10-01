import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

export const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5; // 2 above, the selected row, 2 below

interface WheelColumnProps {
  max: number;
  value: number;
  label: string; // unit shown beside the selected number, e.g. "weeks"
  onChange: (n: number) => void;
}

/** One iOS-timer-style column of numbers 0..max that snaps to a row. */
export function WheelColumn({ max, value, label, onChange }: WheelColumnProps) {
  const { palette } = useTheme();
  const ref = useRef<ScrollView>(null);
  const [live, setLive] = useState(value); // row currently under the highlight while scrolling
  const numbers = useMemo(() => Array.from({ length: max + 1 }, (_, i) => i), [max]);

  useEffect(() => {
    ref.current?.scrollTo({ y: value * ITEM_HEIGHT, animated: false });
    setLive(value);
  }, [value]);

  const indexFrom = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    Math.min(max, Math.max(0, Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT)));

  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = indexFrom(e);
    setLive(idx);
    if (idx !== value) onChange(idx);
  };

  return (
    <View style={styles.column}>
      <View pointerEvents="none" style={[styles.band, { backgroundColor: palette.accent }]} />
      <ScrollView
        ref={ref}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: value * ITEM_HEIGHT }}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        onScroll={(e) => { const i = indexFrom(e); if (i !== live) setLive(i); }}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={(e) => { if (Math.abs(e.nativeEvent.velocity?.y ?? 0) < 0.05) settle(e); }}
      >
        {numbers.map((n) => {
          const distance = Math.abs(n - live);
          return (
            <Pressable
              key={n}
              style={styles.row}
              onPress={() => ref.current?.scrollTo({ y: n * ITEM_HEIGHT, animated: true })}
              accessibilityLabel={`${n} ${label}`}
            >
              <AppText
                style={[
                  styles.number,
                  { color: palette.cardText, opacity: Math.max(0.2, 1 - distance * 0.35), fontSize: distance === 0 ? 28 : 22 },
                ]}
              >
                {n}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
      {/* The unit label sits beside the number in the highlighted row. */}
      <View pointerEvents="none" style={styles.labelWrap}>
        <AppText numberOfLines={1} adjustsFontSizeToFit style={[styles.label, { color: palette.cardText }]}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: { flex: 1, height: ITEM_HEIGHT * VISIBLE_ROWS, justifyContent: 'center' },
  band: {
    position: 'absolute', left: 0, right: 0, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, borderRadius: ITEM_HEIGHT / 2,
  },
  row: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'flex-end', paddingRight: '48%' },
  number: { textAlign: 'right' },
  labelWrap: {
    position: 'absolute', left: '56%', right: 2, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, justifyContent: 'center',
  },
  label: { fontSize: 16 },
});
