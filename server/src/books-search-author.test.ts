import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

const api = useApi();

const titles = async (q: string): Promise<string[]> => (await api.get<{ title: string }[]>(`/api/books?q=${encodeURIComponent(q)}`)).body.map((book) => book.title).sort();

describe('the search of the collection', () => {
  it('finds the books of an author by a piece of the name', async () => {
    expect(await titles('steinbeck')).toEqual(['Of Mice and Men', 'Reading Steinbeck', 'The Grapes of Wrath']);
    expect(await titles('LOWRY')).toEqual(['Number the Stars', 'The Giver']);
    expect(await titles('harper')).toEqual(['To Kill a Mockingbird']);
  });

  it('still finds a book by a piece of its title', async () => {
    expect(await titles('wrinkle')).toEqual(['A Wrinkle in Time']);
  });
});
