import type { Entity, Event } from "@scope/types";

export type DataSource = {
  getAll: () => Entity<Event>[];
  getById: (id: string) => Entity<Event> | null;
  addOne: (event: Event) => Entity<Event>;
};
