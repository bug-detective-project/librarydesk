import { describe, expect, it } from 'vitest';
import { maskIsbn } from './masks.ts';

describe('the ISBN mask', () => {
  it('puts the dashes between the groups as the digits come', () => {
    expect(maskIsbn('978')).toBe('978');
    expect(maskIsbn('97885')).toBe('978-85');
    expect(maskIsbn('978850800')).toBe('978-85-0800');
    expect(maskIsbn('9788508000005')).toBe('978-85-0800-000-5');
  });

  it('drops what is not a digit and anything after the 13th', () => {
    expect(maskIsbn('978 85 0800 000 5')).toBe('978-85-0800-000-5');
    expect(maskIsbn('ISBN 978-85-0800-000-5')).toBe('978-85-0800-000-5');
    expect(maskIsbn('97885080000051234')).toBe('978-85-0800-000-5');
    expect(maskIsbn('abc')).toBe('');
  });
});
