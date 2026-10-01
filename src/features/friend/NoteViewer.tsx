import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { TagChip } from '../../components/TagChip';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../theme/ThemeProvider';
import type { Note } from '../../types';

interface Props {
  note: Note;
  onExit: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Full note with its tags, an Edit link and a Delete Note button (Edit_note.JPG). */
export function NoteViewer({ note, onExit, onEdit, onDelete }: Props) {
  const { t, formatDate } = useI18n();
  const { palette } = useTheme();
  const { height } = useWindowDimensions();

  return (
    <View>
      <View style={styles.titleRow}>
        <AppText style={[styles.title, { color: palette.accent }]}>{t('notes.fullNote')}</AppText>
        <Pressable onPress={onExit} accessibilityRole="button" hitSlop={10}>
          <AppText style={[styles.exit, { color: palette.accent }]}>{t('notes.exit')}</AppText>
        </Pressable>
      </View>

      <View style={[styles.textBox, { maxHeight: Math.min(420, height * 0.45) }]}>
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.textContent}>
          <AppText style={[styles.text, { color: palette.cardText }]}>{note.text}</AppText>
        </ScrollView>
      </View>
      <AppText style={[styles.date, { color: palette.accent }]}>{formatDate(note.createdAt)}</AppText>

      <View style={styles.filtersRow}>
        <AppText style={[styles.filtersLabel, { color: palette.accent }]}>{t('notes.filters')}</AppText>
        {note.tags.map((tag) => <TagChip key={tag} label={tag} selected />)}
        <Pressable onPress={onEdit} accessibilityRole="button" hitSlop={10}>
          <AppText style={[styles.edit, { color: palette.secondary }]}>{t('notes.edit')}</AppText>
        </Pressable>
      </View>

      <View style={styles.deleteRow}>
        <FlashPressable color="#FFC9B8" onPress={onDelete} style={styles.deleteButton}>
          <AppText style={[styles.deleteText, { color: palette.important }]}>{t('notes.delete')}</AppText>
        </FlashPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 28 },
  exit: { fontSize: 24 },
  textBox: { backgroundColor: '#fff', borderRadius: 22 },
  textContent: { padding: 16 },
  text: { fontSize: 22, lineHeight: 30 },
  date: { fontSize: 16, marginTop: 6, textAlign: 'right' },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 },
  filtersLabel: { fontSize: 22 },
  edit: { fontSize: 18, textDecorationLine: 'underline' },
  deleteRow: { alignItems: 'flex-end', marginTop: 16 },
  deleteButton: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
  deleteText: { fontSize: 22 },
});
