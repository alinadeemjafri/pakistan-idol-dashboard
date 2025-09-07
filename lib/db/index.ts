import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as sqliteSchema from './schema';
import * as postgresSchema from './schema-postgres';

const isProduction = process.env.NODE_ENV === 'production' && (process.env.DATABASE_URL || process.env.DB_POSTGRES_URL);

let db: any;

if (isProduction) {
  // PostgreSQL for production
  const databaseUrl = process.env.DATABASE_URL || process.env.DB_POSTGRES_URL!;
  const sql = postgres(databaseUrl);
  db = drizzlePg(sql, { schema: postgresSchema });
} else {
  // SQLite for development
  const sqlite = new Database('./sqlite.db');
  db = drizzle(sqlite, { schema: sqliteSchema });
}

export { db };
export * from './schema';
export * from './schema-postgres';
