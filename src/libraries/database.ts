import { Client, Pool } from "deno-postgres";

const POOL_CONNECTION_COUNT = 20;

const pool = new Pool({
  hostname: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "example",
}, POOL_CONNECTION_COUNT);

export async function withConnection<T>(fn: (client: Client) => Promise<T>) {
  const client = await pool.connect();

  let result;

  try {
    result = await fn(client);
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }

  return result;
}

export type { Client, Transaction } from "deno-postgres";
