import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { TagChip } from '../../components/TagChip';
import { useI18n } from '../../i18n/I18nProvider';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import type { Note, NoteSort } from '../../types';

interface Props {
  notes: Note[];          // already filtered + sorted
  totalCount: number;     // notes before filtering, to pick the right empty message
  tags: string[];         // tag library, for the filter chips
  query: string;
  onQueryChange: (q: string) => void;
  sort: NoteSort;
  onToggleSort: () => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onAdd: () => void;
  onOpen: (note: Note) => void;
}

/** "Extra Note:" list with add button, sort, filter, search and tappable entries (Person.JPG). */
export function NotesList(p: Props) {
  const { t, formatDate } = useI18n();
  const { palette } = useTheme();
  const { height } = useWindowDimensions();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View>
      <View style={styles.titleRow}>
        <AppText style={[styles.title, { color: palette.accent }]}>{t('notes.title')}</AppText>
        <FlashPressable color={palette.accent} onPress={p.onAdd} style={styles.addButton}>
          <AppText style={[styles.addText, { color: palette.cardText }]}>{t('notes.add')}</AppText>
        </FlashPressable>
      </View>

      <View style={styles.toolbar}>
        <Pressable onPress={p.onToggleSort} style={styles.tool} accessibilityRole="button">
          <Ionicons name={p.sort === 'newest' ? 'arrow-down' : 'arrow-up'} size={20} color={palette.secondary} />
          <AppText style={[styles.toolText, { color: palette.accent }]}>
            {p.sort === 'newest' ? t('notes.newest') : t('notes.oldest')}
          </AppText>
        </Pressable>
        <Pressable onPress={() => setFilterOpen((o) => !o)} style={styles.tool} accessibilityRole="button">
          <Ionicons name={p.selectedTags.length ? 'funnel' : 'funnel-outline'} size={20} color={palette.secondary} />
          <AppText style={[styles.toolText, { color: palette.accent }]}>
            {t('notes.filter')}{p.selectedTags.length ? ` (${p.selectedTags.length})` : ''}
          </AppText>
        </Pressable>
        <View style={styles.searchWrap}>
          <AppText style={[styles.toolText, { color: palette.accent }]}>{t('notes.search')}</AppText>
          <TextInput
            value={p.query}
            onChangeText={p.onQueryChange}
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.searchInput, { color: palette.cardText, borderBottomColor: palette.accent, fontFamily: FONT_FAMILY }]}
          />
        </View>
      </View>

      {filterOpen && (
        <View style={styles.filterChips}>
          {p.tags.map((tag) => (
            <TagChip key={tag} label={tag} selected={p.selectedTags.includes(tag)} onPress={() => p.onToggleTag(tag)} />
          ))}
        </View>
      )}

      <View style={[styles.listBox, { backgroundColor: '#fff', maxHeight: Math.min(440, height * 0.45) }]}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {p.notes.length === 0 ? (
            <AppText style={[styles.empty, { color: palette.cardText }]}>
              {p.totalCount === 0 ? t('notes.empty') : t('notes.noMatches')}
            </AppText>
          ) : (
            p.notes.map((note) => (
              <FlashPressable key={note.id} color={palette.accent} onPress={() => p.onOpen(note)} style={styles.entry}>
                <AppText numberOfLines={2} style={[styles.entryText, { color: palette.cardText }]}>{note.text}</AppText>
                <View style={styles.entryMeta}>
                  <View style={styles.entryTags}>
                    {note.tags.map((tag) => <TagChip key={tag} label={tag} small />)}
                  </View>
                  <AppText style={[styles.entryDate, { color: palette.cardText }]}>{formatDate(note.createdAt)}</AppText>
                </View>
              </FlashPressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28 },
  addButton: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 22 },
  addText: { fontSize: 24 },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10, marginBottom: 8, flexWrap: 'wrap' },
  tool: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toolText: { fontSize: 20 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 140 },
  searchInput: { flex: 1, fontSize: 20, borderBottomWidth: 2, paddingVertical: 2 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  listBox: { borderRadius: 22 },
  listContent: { padding: 12, gap: 10 },
  entry: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  entryText: { fontSize: 20 },
  entryMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 8 },
  entryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  entryDate: { fontSize: 14, opacity: 0.8 },
  empty: { fontSize: 20, textAlign: 'center', padding: 24 },
});
