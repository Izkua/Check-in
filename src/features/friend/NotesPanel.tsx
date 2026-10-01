import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ConfirmDeleteDialog } from '../../components/ConfirmDialog';
import { useI18n } from '../../i18n/I18nProvider';
import { addTag, createNote, filterAndSortNotes, removeNote, updateNote } from '../../lib/notes';
import { useTheme } from '../../theme/ThemeProvider';
import type { Note, NoteSort } from '../../types';
import { NoteEditor } from './NoteEditor';
import { NotesList } from './NotesList';
import { NoteViewer } from './NoteViewer';

interface Props {
  notes: Note[];
  tags: string[];
  onChange: (patch: { notes?: Note[]; tags?: string[] }) => void;
}

type Mode = { type: 'list' } | { type: 'view'; id: string } | { type: 'edit'; id: string | null };

/**
 * The "Extra Note" box on the Friend screen. Switches between the list, a single full note,
 * and the add/edit form, exactly as in the four note designs.
 */
export function NotesPanel({ notes, tags, onChange }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  const [mode, setMode] = useState<Mode>({ type: 'list' });
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<NoteSort>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const visible = useMemo(
    () => filterAndSortNotes(notes, { query, tags: selectedTags, sort }),
    [notes, query, selectedTags, sort],
  );
  const current = mode.type !== 'list' && mode.id ? notes.find((n) => n.id === mode.id) : undefined;

  const toggleTag = (tag: string) =>
    setSelectedTags((s) => (s.includes(tag) ? s.filter((x) => x !== tag) : [...s, tag]));

  const submit = ({ text, tags: noteTags, library }: { text: string; tags: string[]; library: string[] }) => {
    const mergedLibrary = library.reduce(addTag, tags);
    if (mode.type === 'edit' && mode.id) {
      onChange({ notes: updateNote(notes, mode.id, text, noteTags), tags: mergedLibrary });
      setMode({ type: 'view', id: mode.id });
    } else {
      onChange({ notes: [...notes, createNote(text, noteTags)], tags: mergedLibrary });
      setMode({ type: 'list' });
    }
  };

  const confirmDelete = () => {
    if (current) onChange({ notes: removeNote(notes, current.id) });
    setConfirmingDelete(false);
    setMode({ type: 'list' });
  };

  return (
    <View style={[styles.panel, { backgroundColor: palette.card }]}>
      {mode.type === 'list' && (
        <NotesList
          notes={visible}
          totalCount={notes.length}
          tags={tags}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onToggleSort={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onAdd={() => setMode({ type: 'edit', id: null })}
          onOpen={(n) => setMode({ type: 'view', id: n.id })}
        />
      )}

      {mode.type === 'view' && current && (
        <NoteViewer
          note={current}
          onExit={() => setMode({ type: 'list' })}
          onEdit={() => setMode({ type: 'edit', id: current.id })}
          onDelete={() => setConfirmingDelete(true)}
        />
      )}

      {mode.type === 'edit' && (
        <NoteEditor
          // remount so the form resets when switching between notes
          key={mode.id ?? 'new'}
          initialText={current?.text ?? ''}
          initialTags={current?.tags ?? []}
          library={tags}
          submitLabel={mode.id ? t('notes.save') : t('notes.add')}
          onSubmit={submit}
          onCancel={() => setMode(mode.id ? { type: 'view', id: mode.id } : { type: 'list' })}
        />
      )}

      <ConfirmDeleteDialog visible={confirmingDelete} onReturn={() => setConfirmingDelete(false)} onConfirm={confirmDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 28, padding: 16 },
});
