import type { DashboardLayout } from '../../types';

/** "2x3" means 2 columns and 3 rows fit on a phone screen. */
export const LAYOUTS: Record<DashboardLayout, { cols: number; rows: number }> = {
  '2x3': { cols: 2, rows: 3 },
  '3x4': { cols: 3, rows: 4 },
  '4x5': { cols: 4, rows: 5 },
};
export const LAYOUT_ORDER: DashboardLayout[] = ['2x3', '3x4', '4x5'];

export const TABLET_MIN_WIDTH = 700;
export const TABLET_EXTRA_COLUMNS = 2; // iPad gets a wider grid
export const MAX_CONTENT_WIDTH = 1200;
export const SCREEN_PADDING = 20;
export const GRID_GAP = 12;

export function getColumns(layout: DashboardLayout, screenWidth: number): number {
  const base = LAYOUTS[layout].cols;
  return screenWidth >= TABLET_MIN_WIDTH ? base + TABLET_EXTRA_COLUMNS : base;
}

export function getContentWidth(screenWidth: number): number {
  return Math.min(screenWidth, MAX_CONTENT_WIDTH) - SCREEN_PADDING * 2;
}

export function getCardWidth(contentWidth: number, columns: number): number {
  return Math.floor((contentWidth - GRID_GAP * (columns - 1)) / columns);
}
