import { darkenHex, mix, readableTextOn } from '../lib/color';

/** The four colors the user can change on the Color Palette page. */
export interface BaseColors {
  primary: string;    // page base color (shows through the background image)
  secondary: string;  // buttons, icons, selected chips
  accent: string;     // titles, pills, panels
  important: string;  // delete / errors
}

/** Defaults sampled from designs/Colors_logos.JPG and Colors.JPG. */
export const DEFAULT_COLORS: BaseColors = {
  primary: '#A4D484',
  secondary: '#8CC46C',
  accent: '#FCE0B8',
  important: '#E53935',
};

/** Everything screens use: the four chosen colors plus colors derived from them. */
export interface Palette extends BaseColors {
  card: string;        // cream panel surface (a soft tint of accent)
  cardText: string;    // readable text on cards (a deep tone of secondary)
  onSecondary: string; // text on secondary-colored buttons
}

export function buildPalette(c: BaseColors): Palette {
  return {
    ...c,
    card: mix(c.accent, '#FFFFFF', 0.5),
    cardText: darkenHex(c.secondary, 0.45),
    onSecondary: readableTextOn(c.secondary),
  };
}

/** Darkens a #RRGGBB color by `amount` (0-1). Used for the press-flash on buttons. */
export function darken(hex: string, amount = 0.12): string {
  return darkenHex(hex, amount);
}
