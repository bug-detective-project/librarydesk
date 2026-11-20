import { QueryTypes, Sequelize } from 'sequelize';
import { defineModels } from './models.ts';
import { seedDatabase } from './seed.ts';

export function openDatabase(url: string): Sequelize {
  const sequelize = new Sequelize(url, { dialect: 'mysql', logging: false, timezone: '+00:00' });
  defineModels(sequelize);
  return sequelize;
}

/** Empties the database, creates the tables from the models and puts the sample library in them. */
export async function resetDatabase(sequelize: Sequelize): Promise<void> {
  await sequelize.sync({ force: true });
  await seedDatabase();
}

/** False for a database that was never reset: it has no tables yet. */
export async function isInitialized(sequelize: Sequelize): Promise<boolean> {
  const rows = await sequelize.query<{ found: number }>(
    'select count(*) as found from information_schema.tables where table_schema = database() and table_name = \'books\'',
    { type: QueryTypes.SELECT },
  );
  return Number(rows[0]?.found ?? 0) > 0;
}
