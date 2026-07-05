import { organization } from "./auth";

export * from "./auth";
export * from "./pets";
export * from "./posts";
export * from "./photos";
export * from "./reactions";

export type Space = typeof organization.$inferSelect;
export type NewSpace = typeof organization.$inferInsert;
