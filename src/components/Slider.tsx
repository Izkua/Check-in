import React, { useRef, useState } from 'react';
import { AccessibilityActionEvent, PanResponder, StyleSheet, View } from 'react-native';

const THUMB_WIDTH = 10;
const THUMB_HEIGHT = 32;

interface Props {
  /** 0..1 */
  value: number;
  onChange: (value: number) => void;
  label: string; // accessibility label
  color: string;
  /** Optional custom track (e.g. a rainbow for hue). Rendered behind the thumb. */
  track?: React.ReactNode;
}

/** Drag-or-tap slider with a tick thumb, like the sketch in Sound.JPG. */
export function Slider({ value, onChange, label, color, track }: Props) {
  const box = useRef<View>(null);
  const origin = useRef({ x: 0, width: 1 });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [width, setWidth] = useState(0);

  const setFromPageX = (pageX: number) => {
    const usable = Math.max(1, origin.current.width - THUMB_WIDTH);
    const ratio = (pageX - origin.current.x - THUMB_WIDTH / 2) / usable;
    onChangeRef.current(Math.min(1, Math.max(0, ratio)));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // keep the drag even inside a ScrollView
      onPanResponderGrant: (_e, g) => {
        box.current?.measureInWindow((x, _y, w) => {
          origin.current = { x, width: w };
          setFromPageX(g.x0);
        });
      },
      onPanResponderMove: (_e, g) => setFromPageX(g.moveX),
    }),
  ).current;

  const onAction = (e: AccessibilityActionEvent) => {
    const step = e.nativeEvent.actionName === 'increment' ? 0.1 : -0.1;
    onChange(Math.min(1, Math.max(0, value + step)));
  };

  const left = value * Math.max(0, width - THUMB_WIDTH);

  return (
    <View
      ref={box}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={styles.hit}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={onAction}
      {...pan.panHandlers}
    >
      {track ?? <View style={[styles.line, { backgroundColor: color }]} />}
      <View style={[styles.endCap, styles.leftCap, { borderColor: color }]} />
      <View style={[styles.endCap, styles.rightCap, { borderColor: color }]} />
      <View style={[styles.thumb, { left, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  hit: { height: 48, justifyContent: 'center' },
  line: { height: 6, borderRadius: 3, marginHorizontal: 6 },
  endCap: { position: 'absolute', width: 18, height: 18, borderRadius: 9, borderWidth: 3, top: 15 },
  leftCap: { left: -4 },
  rightCap: { right: -4 },
  thumb: { position: 'absolute', width: THUMB_WIDTH, height: THUMB_HEIGHT, borderRadius: 5, top: 8 },
});
