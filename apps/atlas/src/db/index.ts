import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import type { Env } from '../types';
import * as schema from './schema';

export async function getDb(env: Env) {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  return drizzle(client, { schema });
}
