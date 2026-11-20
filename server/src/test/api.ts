import type { Express } from 'express';
import type { Sequelize } from 'sequelize';
import request from 'supertest';
import { afterAll, beforeEach } from 'vitest';
import { createApp } from '../app.ts';
import { resetDatabase } from '../db.ts';
import { testDatabase } from './database.ts';

export interface Answer<Body> {
  status: number;
  body: Body;
}

export interface TestApi {
  /** What the server logged about errors nobody planned for. */
  log: string[];
  get<Body = unknown>(url: string): Promise<Answer<Body>>;
  post<Body = unknown>(url: string, payload?: object): Promise<Answer<Body>>;
}

/**
 * The API over the test database, with the sample library back before every test of the file. The
 * day is a Monday, 2026-03-09, at a quarter past ten in the morning; a test may move the clock.
 */
export function useApi(): TestApi {
  let sequelize: Sequelize | undefined;
  let app: Express;
  const log: string[] = [];

  beforeEach(async () => {
    process.env.LIBRARYDESK_TODAY = '2026-03-09';
    process.env.LIBRARYDESK_TIME = '10:15';
    if (sequelize) {
      await resetDatabase(sequelize);
    } else {
      sequelize = await testDatabase();
      app = createApp({ log: (line) => log.push(line) });
    }
    log.length = 0;
  });

  afterAll(async () => {
    await sequelize?.close();
  });

  const answer = <Body>(response: request.Response): Answer<Body> => ({ status: response.status, body: response.body as Body });

  return {
    log,
    get: async (url) => answer(await request(app).get(url).set('Host', 'localhost:3001')),
    post: async (url, payload) => answer(await request(app).post(url).set('Host', 'localhost:3001').send(payload ?? {})),
  };
}
