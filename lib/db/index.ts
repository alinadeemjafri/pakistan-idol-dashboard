import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.startsWith('postgresql');

let db: any;

if (isProduction) {
  // PostgreSQL for production
  const sql = postgres(process.env.DATABASE_URL!);
  db = drizzlePg(sql, { schema });
} else {
  // SQLite for development
  const sqlite = new Database('./sqlite.db');
  db = drizzle(sqlite, { schema });
}

export { db };
export * from './schema';
