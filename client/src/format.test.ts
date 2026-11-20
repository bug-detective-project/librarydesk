import { describe, expect, it } from 'vitest';
import { formatDay, formatDollars, initials } from './format.ts';

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
});
