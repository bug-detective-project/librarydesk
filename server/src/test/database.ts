import mysql from 'mysql2/promise';
import type { Sequelize } from 'sequelize';
import { databaseUrl } from '../config.ts';
import { openDatabase, resetDatabase } from '../db.ts';

/** The tests never touch the database of DATABASE_URL: they use this one, on the same server. */
export const TEST_DATABASE = 'librarydesk_test';

async function ensureTestDatabase(): Promise<string> {
  const admin = await mysql.createConnection(databaseUrl());
  try {
    await admin.query(`create database if not exists ${TEST_DATABASE}`);
  } finally {
    await admin.end();
  }
  const url = new URL(databaseUrl());
  url.pathname = `/${TEST_DATABASE}`;
  return url.toString();
}

/** The test database, freshly reset: open it in beforeAll or beforeEach and close it afterwards. */
export async function testDatabase(): Promise<Sequelize> {
  const sequelize = openDatabase(await ensureTestDatabase());
  await resetDatabase(sequelize);
  return sequelize;
}
