import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Railway automatically provides DATABASE_URL
const client = postgres(process.env.DATABASE_URL || 'postgresql://localhost:5432/pakistan_idol');
export const db = drizzle(client, { schema });

export * from './schema';
