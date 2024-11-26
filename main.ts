import { getApplication, getRouter } from "./src/libraries/http.ts";
import { getRouter as getEventsRouter } from "./src/controllers/events/mod.ts";
import { PATH_AUTH, PATH_EVENTS, PATH_VERSION_1 } from "./src/constants.ts";
import { Entity, Event } from "./src/libraries/types.ts";
import { getRouterAuth } from "./src/controllers/auth/mod.ts";
import { getDatabasePsql } from "./src/database/psql/mod.ts";

const eventsMock: Entity<Event>[] = [
  {
    type: "event",
    id: "0",
    name: "Tapahtuma 1",
  },
  {
    type: "event",
    id: "1",
    name: "Tapahtuma 2",
  },
];

const routerRoot = getRouter();

routerRoot.use(
  `${PATH_VERSION_1}${PATH_EVENTS}`,
  getEventsRouter({
    getAll: () => eventsMock,
    getById: (id) => {
      return eventsMock.find((e) => e.id === id) ?? null;
    },
    addOne: (event) => {
      const newEvent = {
        ...event,
        id: String(eventsMock.length),
      };

      eventsMock.push(newEvent);

      return newEvent;
    },
  }).routes(),
);

const database = await getDatabasePsql();

const routerAuth = getRouterAuth(database);

routerRoot.use(
  `${PATH_AUTH}`,
  routerAuth.routes(),
);

console.log("listening to following routes");
for (const r of routerRoot) {
  console.log(r.path, r.methods);
}

const app = getApplication();
const port = 8080;

app.use(routerRoot.routes());
app.use(routerRoot.allowedMethods());

console.log(`Server running at http://localhost:${port}`);

app.listen({ port });
