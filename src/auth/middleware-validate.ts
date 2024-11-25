import { COOKIE_KEY_AUTH } from "../constants.ts";
import { getJwtPayload } from "../libraries/jwt.ts";
import type { MiddlewareAuthorized } from "../libraries/http.ts";

export const validate: MiddlewareAuthorized = async (
  ctx,
  next,
) => {
  const { cookies, response, state: originalState } = ctx;

  const token = await cookies.get(COOKIE_KEY_AUTH);

  if (!token?.length) {
    response.status = 401;
    response.body = {
      error: "Unauthorized",
    };
    console.error("While authorizing: missing authorization cookie");

    return;
  }

  try {
    const payload = await getJwtPayload(token);

    if (!payload.userId.length) {
      response.status = 400;
      response.body = {
        error: "Invalid token",
      };

      return;
    }

    ctx.state.auth = payload;
  } catch (e) {
    response.status = 401;
    response.body = {
      error: "Unauthorized",
    };

    console.error("While authorizing: token validation failed", e);

    return;
  }

  await next();
  ctx.state = originalState;
};
