import React, { useMemo, useState } from 'react';
import { FlatList, LayoutAnimation, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';
import { RoundIconButton } from '../../components/RoundIconButton';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useI18n } from '../../i18n/I18nProvider';
import { sortAndFilterFriends } from '../../lib/sortFriends';
import { useStoredState } from '../../lib/useStoredState';
import { useTheme } from '../../theme/ThemeProvider';
import type { DashboardLayout, Friend, SortMode } from '../../types';
import { useFriends } from '../friends/FriendsProvider';
import { EmptyState } from './EmptyState';
import { FriendCard } from './FriendCard';
import { FriendCardSkeleton } from './FriendCardSkeleton';
import { GRID_GAP, LAYOUTS, SCREEN_PADDING, getCardWidth, getColumns, getContentWidth } from './gridLayout';
import { LayoutDropdown } from './LayoutDropdown';
import { MenuPill } from './MenuPill';
import { SearchSortPanel } from './SearchSortPanel';

const PULL_TO_REVEAL = -60; // overscroll distance that opens the search/sort panel
const SCROLL_TO_HIDE = 40;  // scrolling this far down hides it again (if no search text)

/** Home screen (Dashboard1.JPG / Dashboard2.JPG). */
export function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { palette } = useTheme();
  const { friends, loading } = useFriends();
  const { width } = useWindowDimensions();

  const [layout, setLayout] = useStoredState<DashboardLayout>('checkin.layout', '2x3');
  const [sort, setSort] = useStoredState<SortMode>('checkin.sort', 'mostOverdue');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const columns = getColumns(layout, width);
  const cardWidth = getCardWidth(getContentWidth(width), columns);
  const visible = useMemo(() => sortAndFilterFriends(friends, sort, query), [friends, sort, query]);

  const setPanel = (open: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPanelOpen(open);
  };
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y < PULL_TO_REVEAL && !panelOpen) setPanel(true);
    else if (y > SCROLL_TO_HIDE && panelOpen && !query) setPanel(false);
  };

  const openFriend = (f: Friend) => router.push({ pathname: '/friend/[id]', params: { id: f.id } });
  const go = (route: string) => { setMenuOpen(false); router.push(route as never); };

  const skeletonCount = columns * LAYOUTS[layout].rows;

  return (
    <ScreenBackground>
      <View style={[styles.content, { paddingHorizontal: SCREEN_PADDING }]}>
        <View style={styles.header}>
          <AppText style={[styles.title, { color: palette.accent }]}>{t('dashboard.title')}</AppText>
          <View style={styles.headerButtons}>
            <RoundIconButton icon="person-add-outline" label={t('a11y.addFriend')} onPress={() => router.push('/friend/new')} />
            <RoundIconButton icon="menu" label={t('a11y.menu')} onPress={() => { setLayoutOpen(false); setMenuOpen(true); }} />
          </View>
        </View>

        <LayoutDropdown
          value={layout}
          open={layoutOpen}
          onToggle={() => setLayoutOpen((o) => !o)}
          onSelect={(l) => { setLayout(l); setLayoutOpen(false); }}
        />

        <View style={styles.gridArea}>
          {panelOpen && <SearchSortPanel query={query} onQueryChange={setQuery} sort={sort} onSortChange={setSort} />}

          {loading ? (
            <View style={[styles.skeletonGrid, { gap: GRID_GAP }]}>
              {Array.from({ length: skeletonCount }, (_, i) => <FriendCardSkeleton key={i} width={cardWidth} />)}
            </View>
          ) : (
            <FlatList
              key={columns /* FlatList can't change numColumns in place */}
              data={visible}
              keyExtractor={(f) => f.id}
              numColumns={columns}
              columnWrapperStyle={{ gap: GRID_GAP }}
              contentContainerStyle={{ gap: GRID_GAP, paddingBottom: insets.bottom + 24 }}
              renderItem={({ item }) => <FriendCard friend={item} width={cardWidth} onPress={openFriend} />}
              ListEmptyComponent={<EmptyState searching={query.trim().length > 0} />}
              alwaysBounceVertical
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onScrollEndDrag={onScrollEnd}
              onScrollBeginDrag={() => setLayoutOpen(false)}
            />
          )}
        </View>
      </View>

      {menuOpen && <MenuPill top={insets.top + 12} onClose={() => setMenuOpen(false)} onNavigate={go} />}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  title: {
    fontSize: 46,
    textShadowColor: 'rgba(63,122,43,0.45)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3,
  },
  gridArea: { flex: 1, marginTop: 12 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap' },
});
