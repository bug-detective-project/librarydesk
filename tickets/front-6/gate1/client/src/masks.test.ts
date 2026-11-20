import { describe, expect, it } from 'vitest';
import { maskIsbn } from './masks.ts';

describe('the ISBN mask', () => {
  it('puts the dashes between the groups as the digits come', () => {
    expect(maskIsbn('978')).toBe('978');
    expect(maskIsbn('9780')).toBe('978-0');
    expect(maskIsbn('97803064')).toBe('978-0-3064');
    expect(maskIsbn('9780306406157')).toBe('978-0-3064-0615-7');
  });

  it('drops what is not a digit and anything after the 13th', () => {
    expect(maskIsbn('978 0 3064 0615 7')).toBe('978-0-3064-0615-7');
    expect(maskIsbn('ISBN 978-0-306-40615-7')).toBe('978-0-3064-0615-7');
    expect(maskIsbn('97803064061571234')).toBe('978-0-3064-0615-7');
    expect(maskIsbn('abc')).toBe('');
  });
});
