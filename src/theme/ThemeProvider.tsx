import React, { createContext, useContext, useMemo } from 'react';
import { backgroundUriFor } from '../lib/backgroundStorage';
import { usePersistedJson } from '../lib/usePersistedJson';
import { BaseColors, DEFAULT_COLORS, Palette, buildPalette } from './colors';

interface ThemeState {
  colors: BaseColors;
  /** File name of the uploaded background photo, or null for the default Background.jpg. */
  backgroundFile: string | null;
}

const DEFAULT_THEME: ThemeState = { colors: DEFAULT_COLORS, backgroundFile: null };

interface ThemeValue {
  palette: Palette;
  backgroundUri: string | null;
  backgroundFile: string | null;
  setColor: (key: keyof BaseColors, hex: string) => void;
  setBackgroundFile: (fileName: string | null) => void;
  /** Revert button: default colors and default background. */
  resetTheme: () => void;
  /** False until saved choices have loaded. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeValue | null>(null);

const revive = (raw: unknown): ThemeState => {
  const r = (raw ?? {}) as Partial<ThemeState>;
  return { colors: { ...DEFAULT_COLORS, ...r.colors }, backgroundFile: r.backgroundFile ?? null };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, ready] = usePersistedJson<ThemeState>('checkin.theme.v1', DEFAULT_THEME, revive);

  const value = useMemo<ThemeValue>(
    () => ({
      palette: buildPalette(state.colors),
      backgroundUri: state.backgroundFile ? backgroundUriFor(state.backgroundFile) : null,
      backgroundFile: state.backgroundFile,
      setColor: (key, hex) => setState((s) => ({ ...s, colors: { ...s.colors, [key]: hex } })),
      setBackgroundFile: (fileName) => setState((s) => ({ ...s, backgroundFile: fileName })),
      resetTheme: () => setState(DEFAULT_THEME),
      ready,
    }),
    [state, setState, ready],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
