import React from 'react';
import { useRouter } from 'expo-router';
import { RoundIconButton } from './RoundIconButton';
import { useI18n } from '../i18n/I18nProvider';

/** Round "back to dashboard" button used on every non-dashboard page. */
export function BackButton() {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <RoundIconButton
      icon="arrow-undo-outline"
      label={t('a11y.back')}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      size={44}
    />
  );
}
