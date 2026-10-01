import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { AppText } from '../../components/AppText';
import { FlashPressable } from '../../components/FlashPressable';
import { TagChip } from '../../components/TagChip';
import { useI18n } from '../../i18n/I18nProvider';
import { addTag, normalizeTag } from '../../lib/notes';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  initialText: string;
  initialTags: string[];
  /** Tags the user already created for this friend. */
  library: string[];
  /** "Add" for a new note, "Save" when editing an existing one. */
  submitLabel: string;
  onSubmit: (result: { text: string; tags: string[]; library: string[] }) => void;
  onCancel: () => void;
}

/**
 * Write or edit a note and pick its tags (Edit_add_note.JPG). Editing an existing note
 * uses the same form, prefilled. Tags toggle solid when selected; "New tag" creates one.
 */
export function NoteEditor({ initialText, initialTags, library, submitLabel, onSubmit, onCancel }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const { height } = useWindowDimensions();
  const [text, setText] = useState(initialText);
  const [selected, setSelected] = useState<string[]>(initialTags);
  const [allTags, setAllTags] = useState<string[]>(library);
  const [creating, setCreating] = useState(false);
  const [draftTag, setDraftTag] = useState('');

  const toggle = (tag: string) =>
    setSelected((s) => (s.includes(tag) ? s.filter((x) => x !== tag) : [...s, tag]));

  const commitTag = () => {
    const tag = normalizeTag(draftTag);
    if (tag) {
      const next = addTag(allTags, tag);
      // If it matched an existing tag (ignoring case), select that one instead of a duplicate.
      const stored = next.find((x) => x.toLowerCase() === tag.toLowerCase())!;
      setAllTags(next);
      setSelected((s) => (s.includes(stored) ? s : [...s, stored]));
    }
    setDraftTag('');
    setCreating(false);
  };

  const canSubmit = text.trim().length > 0;

  return (
    <View>
      <AppText style={[styles.title, { color: palette.accent }]}>{t('notes.title')}</AppText>

      <View style={styles.actions}>
        <FlashPressable
          color={palette.accent}
          disabled={!canSubmit}
          onPress={() => onSubmit({ text, tags: selected, library: allTags })}
          style={[styles.actionButton, !canSubmit && styles.disabled]}
        >
          <AppText style={[styles.actionText, { color: palette.cardText }]}>{submitLabel}</AppText>
        </FlashPressable>
        <FlashPressable color={palette.accent} onPress={onCancel} style={styles.actionButton}>
          <AppText style={[styles.actionText, { color: palette.cardText }]}>{t('notes.cancel')}</AppText>
        </FlashPressable>
      </View>

      <View style={styles.body}>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          autoFocus={initialText.length === 0}
          placeholder={t('notes.placeholder')}
          placeholderTextColor={palette.secondary}
          textAlignVertical="top"
          style={[styles.input, { color: palette.cardText, minHeight: 200, maxHeight: Math.max(220, height * 0.45), fontFamily: FONT_FAMILY }]}
        />

        <View style={styles.filters}>
          <AppText style={[styles.filtersTitle, { color: palette.accent }]}>{t('notes.filters')}</AppText>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.chipColumn}>
            {allTags.map((tag) => (
              <TagChip key={tag} label={tag} selected={selected.includes(tag)} onPress={() => toggle(tag)} />
            ))}
            {creating ? (
              <TextInput
                value={draftTag}
                onChangeText={setDraftTag}
                onSubmitEditing={commitTag}
                onBlur={commitTag}
                autoFocus
                maxLength={20}
                returnKeyType="done"
                placeholder={t('notes.tagPlaceholder')}
                placeholderTextColor={palette.secondary}
                style={[styles.tagInput, { color: palette.cardText, borderColor: palette.accent, fontFamily: FONT_FAMILY }]}
              />
            ) : (
              <Pressable onPress={() => setCreating(true)} accessibilityRole="button">
                <AppText style={[styles.newTag, { color: palette.accent }]}>+ {t('notes.newTag')}</AppText>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  actionButton: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 24 },
  actionText: { fontSize: 24 },
  disabled: { opacity: 0.45 },
  body: { flexDirection: 'row', gap: 12 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 22, padding: 16, fontSize: 22 },
  filters: { width: '34%', minWidth: 110 },
  filtersTitle: { fontSize: 22, marginBottom: 6 },
  chipColumn: { gap: 8, paddingBottom: 8 },
  newTag: { fontSize: 18, paddingVertical: 4 },
  tagInput: { fontSize: 18, borderWidth: 2, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#fff' },
});
