import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { useI18n } from '../../i18n/I18nProvider';
import type { TranslationKey } from '../../i18n/translations';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import type { SortMode } from '../../types';

const SORTS: { mode: SortMode; label: TranslationKey }[] = [
  { mode: 'mostOverdue', label: 'sort.mostOverdue' },
  { mode: 'leastOverdue', label: 'sort.leastOverdue' },
  { mode: 'alphabetical', label: 'sort.alphabetical' },
];

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  sort: SortMode;
  onSortChange: (s: SortMode) => void;
}

/** Revealed when the user pulls down past the top of the friend grid. */
export function SearchSortPanel({ query, onQueryChange, sort, onSortChange }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: palette.card }]}>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={20} color={palette.secondary} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={t('dashboard.searchPlaceholder')}
          placeholderTextColor={palette.secondary}
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { color: palette.cardText, fontFamily: FONT_FAMILY }]}
        />
      </View>
      <View style={styles.chips}>
        {SORTS.map(({ mode, label }) => {
          const selected = mode === sort;
          return (
            <FlashPressable
              key={mode}
              color={selected ? palette.secondary : palette.accent}
              onPress={() => onSortChange(mode)}
              accessibilityState={{ selected }}
              style={styles.chip}
            >
              <AppText style={[styles.chipText, { color: selected ? palette.onSecondary : palette.cardText }]}>{t(label)}</AppText>
            </FlashPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 24, padding: 12, marginBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14, height: 44, gap: 8, backgroundColor: '#fff' },
  input: { flex: 1, fontSize: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { borderRadius: 18, paddingVertical: 6, paddingHorizontal: 14 },
  chipText: { fontSize: 18 },
});
