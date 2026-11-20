import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, libraryDate, now, today } from './clock.ts';

describe('the library calendar', () => {
  it('counts days across months and years', () => {
    expect(addDays('2026-02-27', 2)).toBe('2026-03-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-09', -14)).toBe('2026-02-23');
    expect(daysBetween('2026-03-09', '2026-03-23')).toBe(14);
    expect(daysBetween('2026-03-09', '2026-03-08')).toBe(-1);
  });

  it('takes the day and the time from the environment when they are set', () => {
    const env = { LIBRARYDESK_TODAY: '2026-03-09', LIBRARYDESK_TIME: '10:15' };
    expect(today(env)).toBe('2026-03-09');
    expect(now(env).toISOString()).toBe('2026-03-09T13:15:00.000Z');
  });

  it('says the day of a moment in São Paulo, not in UTC', () => {
    expect(libraryDate(new Date('2026-03-10T01:30:00Z'))).toBe('2026-03-09');
    expect(libraryDate(new Date('2026-03-10T03:30:00Z'))).toBe('2026-03-10');
  });
});
