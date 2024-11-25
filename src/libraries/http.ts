import { Application as ApplicationOak } from "@oak/oak/application";
import { Router as RouterOak } from "@oak/oak/router";
import type { ApplicationState, ApplicationStateAuthorized } from "../types.ts";
import { oakCors } from "@tajpouria/cors";
import { Middleware as MiddlewareOak } from "@oak/oak/middleware";

export function getApplication() {
  const app = new ApplicationOak<ApplicationState>();

  app.use(oakCors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

  return app;
}

export function getRouter() {
  return new RouterOak<ApplicationState>();
}

export function getRouterAuthorized() {
  return new RouterOak<ApplicationStateAuthorized>();
}

export type Middleware = MiddlewareOak<ApplicationState>;
export type MiddlewareAuthorized = MiddlewareOak<ApplicationStateAuthorized>;
