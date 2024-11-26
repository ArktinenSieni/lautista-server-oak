import type { Client } from "../../../../libraries/database.ts";
import type { Migration } from "../../types.ts";
import { migrate as migration0 } from "./000-base.ts";

export async function migrateBase(client: Client) {
  const migrations: Migration[] = [migration0];

  try {
    for (const migrationFn of migrations) {
      await migrationFn(client);
    }
  } catch (e) {
    console.error("Migrating base failed", e);
  }
}
