import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_PALETTE, Palette } from './colors';

interface ThemeValue {
  palette: Palette;
  /** Used by the Color Palette page (later phase). */
  setPalette: (p: Palette) => void;
  resetPalette: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);
  const value = useMemo(
    () => ({ palette, setPalette, resetPalette: () => setPalette(DEFAULT_PALETTE) }),
    [palette],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
