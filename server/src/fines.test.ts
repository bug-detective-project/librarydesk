import { describe, expect, it } from 'vitest';
import { dollars, fineFor, lateDays } from './fines.ts';

describe('fines', () => {
  it('charges nothing for a book that comes back before its due day', () => {
    expect(lateDays('2026-03-12', new Date('2026-03-09T13:15:00Z'))).toBe(0);
    expect(fineFor('2026-03-12', new Date('2026-03-09T13:15:00Z'))).toBe('0.00');
  });

  it('charges something for a book that comes back days after its due day', () => {
    expect(lateDays('2026-03-01', new Date('2026-03-09T13:15:00Z'))).toBeGreaterThan(0);
    expect(Number(fineFor('2026-03-01', new Date('2026-03-09T13:15:00Z')))).toBeGreaterThan(0);
  });

  it('writes dollars with two decimals', () => {
    expect(dollars(1.75)).toBe('$1.75');
  });
});
