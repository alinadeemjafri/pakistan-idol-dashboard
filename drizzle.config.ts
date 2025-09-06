import type { Config } from 'drizzle-kit';

const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql');

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: isProduction ? 'postgresql' : 'sqlite',
  dbCredentials: isProduction 
    ? {
        url: process.env.DATABASE_URL!,
      }
    : {
        url: './sqlite.db',
      },
} satisfies Config;
