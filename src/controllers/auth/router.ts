import { getJwt } from "../../libraries/jwt.ts";
import { COOKIE_KEY_AUTH } from "../../constants.ts";
import { getRouter } from "../../libraries/http.ts";
import { validate } from "../../middleware/middleware-validate.ts";
import { User } from "@lautista/types";
import type { Database } from "../../database/types.ts";
import { NotFoundError } from "../../errors.ts";
import type { DbUser } from "../../database/mod.ts";
import { testPassword } from "../../libraries/passwords.ts";

export function getRouterAuth(database: DatabaseAuth) {
  const router = getRouter();

  router.post(
    "/login",
    async ({ request, response, cookies }) => {
      const body = await request.body.json();

      if (!("username" in body) || !("password" in body)) {
        response.status = 401;
        response.body = {
          error: "Missing username or password",
        };

        return;
      }

      let user: DbUser;

      try {
        user = await database.getDbUserByUsername(body.username);
      } catch (e) {
        if (e instanceof NotFoundError) {
          response.status = 401;
          response.body = {
            error: errorMessageUnauhtorized,
          };

          return;
        }

        throw e;
      }

      const isValidPassword = await testPassword(body.password, user.salt);

      if (!isValidPassword) {
        response.status = 401;
        response.body = {
          error: errorMessageUnauhtorized,
        };

        return;
      }

      const auth = await getJwt({ userId: user.id });

      await cookies.set(COOKIE_KEY_AUTH, auth);
      response.status = 200;
    },
  );

  router.post(
    "/logout",
    ({ response, cookies }) => {
      cookies.set(COOKIE_KEY_AUTH, "");

      response.status = 200;
    },
  );

  router.get(
    "/user",
    validate,
    async ({ response, state }) => {
      const userId = state.auth.userId;

      let user: User;

      try {
        user = await database.getUserById(userId);
      } catch (e) {
        if (e instanceof NotFoundError) {
          response.status = 404;
          response.body = {
            error: "user not found",
          };

          console.error(`User not found with id ${userId}`);

          return;
        }

        throw e;
      }

      response.body = user;
    },
  );

  return router;
}

const errorMessageUnauhtorized = "unauthorized :(";

type DatabaseAuth = Pick<Database, "getDbUserByUsername" | "getUserById">;
