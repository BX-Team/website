import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import type { Env } from '../types';

export async function getDb(env: Env) {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  return drizzle(client, { schema });
}
