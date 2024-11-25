import { Client } from "deno-postgres";

export function selectUsers() {
  return withConnection(async (client) =>
    await client.queryArray<[string]>(`SELECT username FROM Users`).then(
      (result) => result.rows,
    )
  );
}

const client = new Client({
  hostname: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "example",
});

async function withConnection<T>(fn: (client: Client) => Promise<T>) {
  await client.connect();

  await setupDatabase(client);

  const result = await fn(client);

  await client.end();

  return result;
}

let isDatabaseInitialized = false;

async function setupDatabase(client: Client) {
  if (isDatabaseInitialized) {
    return;
  }

  await setupExtensions(client);

  await Promise.all([
    createUsersTable(client),
  ]);

  isDatabaseInitialized = true;
}

async function setupExtensions(client: Client) {
  await client.queryArray('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

async function createUsersTable(client: Client) {
  await client.queryArray(`
    CREATE TABLE IF NOT EXISTS Users(
      id        UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
      username  VARCHAR(50)       NOT NULL
    )
`);
}
