import { getJwt } from "../../libraries/jwt.ts";
import { COOKIE_KEY_AUTH } from "../../constants.ts";
import { getRouter } from "../../libraries/http.ts";
import { validate } from "../../middleware/middleware-validate.ts";
import { User } from "@lautista/types";
import { NotFoundError } from "../../errors.ts";
import { testPassword } from "../../libraries/passwords.ts";
import type { UsersInterface } from "../../libraries/database/mod.ts";

export function getRouterAuth(database: UsersInterface) {
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

      let hash: string;
      let id: number;

      try {
        const loginInfo = await database.getHashAndIdByUsername(body.username);

        hash = loginInfo.hash;
        id = loginInfo.id;
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

      const isValidPassword = await testPassword(body.password, hash);

      if (!isValidPassword) {
        response.status = 401;
        response.body = {
          error: errorMessageUnauhtorized,
        };

        return;
      }

      const auth = await getJwt({ userId: id });

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
