import type { DataSource } from "./types.ts";
import { isEvent } from "../../libraries/types.ts";
import { getRouterAuthorized } from "../../libraries/http.ts";

export function getRouter(dataSource: DataSource) {
  const router = getRouterAuthorized();

  router.get(
    "/",
    (ctx) => {
      ctx.response.body = dataSource.getAll();
    },
  );

  router.get("/:event", (ctx) => {
    const eventId = ctx.params.event;
    const event = dataSource.getById(eventId);

    if (!event) {
      ctx.response.status = 404;
      return;
    }

    ctx.response.body = event;
  });

  router.post("/", async (ctx) => {
    const body = await ctx.request.body.json();

    if (!isEvent(body)) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: `Invalid body type: ${Object.entries(body)}`,
      };

      return;
    }

    const newEvent = dataSource.addOne(body);

    ctx.response.body = newEvent;
  });

  return router;
}
