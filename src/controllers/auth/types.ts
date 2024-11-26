import type { Database } from "../../database/mod.ts";

export type DatabaseAuth = Pick<
  Database,
  "getDbUserByUsername" | "getUserById"
>;
