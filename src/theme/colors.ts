/** Defaults sampled from designs/Colors_logos.JPG and Colors.JPG. */
export interface Palette {
  primary: string;    // main green
  secondary: string;  // darker green, text + accents
  accent: string;     // peach: buttons, titles, panels
  important: string;  // destructive / attention
  card: string;       // cream panel surface
  cardText: string;
}

export const DEFAULT_PALETTE: Palette = {
  primary: '#A4D484',
  secondary: '#8CC46C',
  accent: '#FCE0B8',
  important: '#E53935',
  card: '#FDEFDB',
  cardText: '#3F7A2B', // darker than secondary so text stays readable on cream
};

/** Darkens a #RRGGBB color by `amount` (0-1). Used for the press-flash on buttons. */
export function darken(hex: string, amount = 0.12): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
