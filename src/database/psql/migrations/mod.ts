import { withConnection } from "../../../libraries/database.ts";
import { migrateBase } from "./base/mod.ts";
import { migrateUsers } from "./users/mod.ts";

let hasBeenMigrated = false;

export async function migrateDatabase() {
  if (hasBeenMigrated) {
    return;
  }

  await withConnection(async (client) => {
    console.info("--- DATABASE MIGRATION START ---");
    await migrateBase(client);
    await migrateUsers(client);
    console.info("--- DATABASE MIGRATION END ---");
  });

  hasBeenMigrated = true;
}
