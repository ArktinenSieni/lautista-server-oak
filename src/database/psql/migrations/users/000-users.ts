import type { Client } from "../../../../libraries/database.ts";
import { getPasswordHash } from "../../../../libraries/passwords.ts";

export async function migrate(client: Client) {
  try {
    await client.queryArray(
      "ALTER TABLE Users ADD CONSTRAINT unique_username UNIQUE (username)",
    );
  } catch {
    console.info("Username is already unique");
  }

  await client.queryArray(
    "ALTER TABLE Users ADD COLUMN IF NOT EXISTS salt TEXT NOT NULL",
  );

  const isAdminExistingQuery = await client.queryArray<[boolean]>(
    "SELECT EXISTS(SELECT 1 FROM Users WHERE username = $1)",
    ["admin"],
  );

  const isAdminExisting = isAdminExistingQuery.rows[0][0];

  if (isAdminExisting) {
    console.info("admin exists");
    return;
  }

  const pwHash = await getPasswordHash("testi");

  await client.queryArray(
    `
    INSERT INTO Users (username, salt) VALUES ($1, $2)
    `,
    ["admin", pwHash],
  );

  await client.queryArray(
    "SELECT * FROM Users",
  ).then((result) => console.log(result.rows));
}
