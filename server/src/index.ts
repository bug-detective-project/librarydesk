import { createApp } from './app.ts';
import { databaseUrl, port } from './config.ts';
import { isInitialized, openDatabase, resetDatabase } from './db.ts';

const sequelize = openDatabase(databaseUrl());
// The first start on a new database: create the tables and the sample library.
if (!(await isInitialized(sequelize))) {
  await resetDatabase(sequelize);
}

createApp().listen(port, '0.0.0.0', () => {
  console.log(`LibraryDesk API on http://localhost:${port}`);
});
