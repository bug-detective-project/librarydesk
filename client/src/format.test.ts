import { describe, expect, it } from 'vitest';
import { finesDue, formatDay, formatReais, initials } from './format.ts';

describe('formats', () => {
  it('writes reais the Brazilian way', () => {
    expect(formatReais(3.5)).toBe('R$ 3,50');
    expect(formatReais(0)).toBe('R$ 0,00');
  });

  it('writes a day of the API as the desk reads it', () => {
    expect(formatDay('2026-03-23')).toBe('Mar 23, 2026');
  });

  it('takes the first and the last initial of a name', () => {
    expect(initials('Ana Souza')).toBe('AS');
    expect(initials('Felipe Araújo Neto')).toBe('FN');
    expect(initials('Ziraldo')).toBe('Z');
  });

  it('counts the fine of a loan that came back late and is not paid', () => {
    const loans = [
      { returnedAt: '2026-03-04T13:15:00.000Z', fine: '1.50', finePaid: false },
      { returnedAt: '2026-02-20T13:15:00.000Z', fine: '2.00', finePaid: true },
      { returnedAt: null, fine: '3.00', finePaid: false },
    ];
    expect(finesDue(loans)).toBe(1.5);
    expect(finesDue([])).toBe(0);
  });
});
