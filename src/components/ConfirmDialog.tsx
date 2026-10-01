import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { FlashPressable } from './FlashPressable';

interface Props {
  visible: boolean;
  onReturn: () => void;
  onConfirm: () => void;
}

/** "Confirm Delete" pop-up with Return / Delete (Edit_delete_note.JPG). */
export function ConfirmDeleteDialog({ visible, onReturn, onConfirm }: Props) {
  const { t } = useI18n();
  const { palette } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onReturn}>
      <Pressable style={styles.backdrop} onPress={onReturn}>
        <Pressable style={[styles.card, { backgroundColor: palette.accent }]} onPress={() => {}}>
          <AppText style={[styles.title, { color: palette.cardText }]}>{t('confirm.title')}</AppText>
          <View style={styles.buttons}>
            <FlashPressable color={palette.card} onPress={onReturn} style={styles.button}>
              <AppText style={[styles.buttonText, { color: palette.cardText }]}>{t('confirm.return')}</AppText>
            </FlashPressable>
            <FlashPressable color="#FFC9B8" onPress={onConfirm} style={styles.button}>
              <AppText style={[styles.buttonText, { color: palette.important }]}>{t('confirm.delete')}</AppText>
            </FlashPressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, borderRadius: 28, padding: 24, alignItems: 'center' },
  title: { fontSize: 32, marginBottom: 20 },
  buttons: { flexDirection: 'row', gap: 14, alignSelf: 'stretch' },
  button: { flex: 1, borderRadius: 20, paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontSize: 26 },
});
