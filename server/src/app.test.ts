import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.ts';
import { useApi } from './test/api.ts';

const api = useApi();

describe('the API', () => {
  it('answers only the local client', async () => {
    const response = await request(createApp()).get('/api/books').set('Host', 'evil.example');

    expect(response.status).toBe(403);
  });

  it('answers 404 in JSON for a path it does not have', async () => {
    expect(await api.get('/api/shelves')).toEqual({ status: 404, body: { error: 'Not found' } });
  });

  it('answers 400 for a body that is not JSON', async () => {
    const response = await request(createApp())
      .post('/api/loans')
      .set('Host', 'localhost:3001')
      .set('Content-Type', 'application/json')
      .send('{"copyId": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The body is not valid JSON' });
  });
});
