import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../components/Skeleton';

/** Loading placeholder with the same footprint as FriendCard. */
export function FriendCardSkeleton({ width }: { width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <Skeleton style={{ width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25 }} />
      <Skeleton style={{ width: width * 0.7, height: Math.max(13, width * 0.15), marginTop: 10 }} />
      <Skeleton style={{ width: width * 0.55, height: Math.max(10, width * 0.085), marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(253,239,219,0.55)' },
});
