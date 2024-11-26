import { NotFoundError } from "../../errors.ts";
import { withConnection } from "../../libraries/database.ts";
import type { User } from "../../libraries/types.ts";
import type { DbUser } from "../types.ts";

export function getUserById(id: number): Promise<User> {
  return withConnection(async (c) => {
    const userQuery = await c.queryArray<[string]>(
      "SELECT username FROM Users WHERE id = $1",
      [id],
    );

    if (!userQuery.rows.length) {
      throw new NotFoundError(`User not found by id ${id}`);
    }

    const userRow = userQuery.rows[0];

    return {
      username: userRow[0],
      type: "user",
    };
  });
}

export function getDbUserByUsername(
  username: string,
): Promise<DbUser> {
  return withConnection(async (c) => {
    const query = await c.queryArray<[number, string, string]>(
      "SELECT id, username, salt FROM Users WHERE username = $1",
      [username],
    );

    if (!query.rows.length) {
      throw new NotFoundError(`User not found by username ${username}`);
    }

    const userRow = query.rows[0];

    return {
      id: userRow[0],
      username: userRow[1],
      salt: userRow[2],
    };
  });
}
