import type { Client } from "../../libraries/database.ts";

export type Migration = (client: Client) => Promise<void>;
