import type { Client } from "../../../../libraries/database.ts";
import type { Migration } from "../../types.ts";
import { migrate as migrate0 } from "./000-users.ts";

export async function migrateUsers(client: Client) {
  const migrations: Migration[] = [migrate0];

  try {
    for (const migration of migrations) {
      await migration(client);
    }
  } catch (e) {
    console.error("users migration failed", e);
  }
}
