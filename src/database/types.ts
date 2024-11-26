import type { User } from "../libraries/types.ts";

export type Database = {
  /**
   * @throws NotFoundError
   */
  getDbUserByUsername: (username: string) => Promise<DbUser>;
  /**
   * @throws NotFoundError
   */
  getUserById: (id: number) => Promise<User>;
};

export type DbUser = {
  salt: string;
  id: number;
  username: string;
};
