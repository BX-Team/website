import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const client = postgres(process.env.DATABASE_URL, {
      connect_timeout: 10,
      idle_timeout: 30,
      max_lifetime: 60 * 30,
      max: 10,
    });
    db = drizzle(client, { schema });
  }
  return db;
}

export { db } from './lazy-db';
