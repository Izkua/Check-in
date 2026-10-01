import { getCardWidth, getColumns, getContentWidth } from '../src/features/dashboard/gridLayout';

describe('gridLayout', () => {
  it('uses the layout columns on phones', () => {
    expect(getColumns('2x3', 390)).toBe(2);
    expect(getColumns('4x5', 390)).toBe(4);
  });
  it('adds columns on iPad', () => {
    expect(getColumns('2x3', 820)).toBe(4);
    expect(getColumns('3x4', 1024)).toBe(5);
  });
  it('cards plus gaps fit inside the content width', () => {
    const content = getContentWidth(390);
    const w = getCardWidth(content, 3);
    expect(w * 3 + 12 * 2).toBeLessThanOrEqual(content);
  });
});
