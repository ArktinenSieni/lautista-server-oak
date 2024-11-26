import type { Client } from "../../../../libraries/database.ts";

export async function migrate(client: Client) {
  await client.queryArray(`
    CREATE TABLE IF NOT EXISTS Users(
      id        INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username  VARCHAR(50)       NOT NULL
    )
`);
}
