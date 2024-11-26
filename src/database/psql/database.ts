import type { Database } from "../types.ts";
import { migrateDatabase } from "./migrations/mod.ts";
import { getDbUserByUsername, getUserById } from "./users.ts";

export async function getDatabase(): Promise<Database> {
  await migrateDatabase();

  return {
    getUserById,
    getDbUserByUsername,
  };
}
