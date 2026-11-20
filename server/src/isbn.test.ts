import { describe, expect, it } from 'vitest';
import { formatIsbn, isValidIsbn, normalizeIsbn, parseIsbn } from './isbn.ts';

describe('ISBN', () => {
  it('checks the check digit of 13 digits', () => {
    expect(isValidIsbn('9788535902778')).toBe(true);
    expect(isValidIsbn('9788535902779')).toBe(false);
    expect(isValidIsbn('978853590277')).toBe(false);
    expect(isValidIsbn('978853590277X')).toBe(false);
  });

  it('takes out the dashes and spaces between the groups', () => {
    expect(normalizeIsbn('978-85-359-0277-8')).toBe('9788535902778');
    expect(normalizeIsbn('978 85 359 0277 8')).toBe('9788535902778');
  });

  it('parses the bare digits and refuses what is not an ISBN', () => {
    expect(parseIsbn('9788535902778')).toBe('9788535902778');
    expect(parseIsbn('9788535902779')).toBeNull();
    expect(parseIsbn('hello')).toBeNull();
  });

  it('prints an ISBN with its groups', () => {
    expect(formatIsbn('9780306406157')).toBe('978-0-3064-0615-7');
  });
});
