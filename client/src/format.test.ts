import { describe, expect, it } from 'vitest';
import { finesDue, formatDay, formatDollars, initials } from './format.ts';

describe('formats', () => {
  it('writes dollars', () => {
    expect(formatDollars(1.75)).toBe('$1.75');
    expect(formatDollars(0)).toBe('$0.00');
  });

  it('writes a day of the API as the desk reads it', () => {
    expect(formatDay('2026-03-23')).toBe('Mar 23, 2026');
  });

  it('takes the first and the last initial of a name', () => {
    expect(initials('Emma Johnson')).toBe('EJ');
    expect(initials('Laura Ann Mitchell')).toBe('LM');
    expect(initials('Avi')).toBe('A');
  });

  it('counts the fine of a loan that came back late and is not paid', () => {
    const loans = [
      { returnedAt: '2026-03-04T15:15:00.000Z', fine: '0.75', finePaid: false },
      { returnedAt: '2026-02-20T15:15:00.000Z', fine: '1.00', finePaid: true },
      { returnedAt: null, fine: '1.50', finePaid: false },
    ];
    expect(finesDue(loans)).toBe(0.75);
    expect(finesDue([])).toBe(0);
  });
});
