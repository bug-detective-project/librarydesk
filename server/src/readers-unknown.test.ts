import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

const api = useApi();

describe('a reader that does not exist', () => {
  it('is answered with 404 in JSON', async () => {
    expect(await api.get('/api/readers/999')).toEqual({ status: 404, body: { error: 'There is no such reader' } });
  });

  it('does not stop the API from answering what comes next', async () => {
    await api.get('/api/readers/999');

    expect((await api.get<{ name: string }>('/api/readers/1')).body.name).toBe('Emma Johnson');
    expect((await api.get('/api/readers/abc')).status).toBe(400);
  });
});
