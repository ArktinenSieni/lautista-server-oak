import { getJwt } from "../libraries/jwt.ts";
import { COOKIE_KEY_AUTH } from "../constants.ts";
import { getRouter } from "../libraries/http.ts";
import { validate } from "./middleware-validate.ts";
import { User } from "@lautista/types";

export const router = getRouter();

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

    const user = usersMock.find((user) => user.username === body.username);
    const isUserExisting = !!user;

    if (!isUserExisting) {
      response.status = 401;
      response.body = {
        error: errorMessageUnauhtorized,
      };

      return;
    }

    const isValidPassword = user.password === body.password;

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
  ({ response, state }) => {
    const userId = state.auth.userId;
    const user = usersMock.find((u) => u.id === userId);

    if (!user) {
      response.status = 404;
      response.body = {
        error: "user not found",
      };

      console.error(`User not found with id ${userId}`);

      return;
    }

    const responseBody: User = {
      username: user.username,
      type: "user",
    };

    response.body = responseBody;
  },
);

const errorMessageUnauhtorized = "unauthorized :(";

const usersMock = [
  {
    username: "testi",
    password: "testi",
    id: "0",
  },
];
