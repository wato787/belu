import { text } from "drizzle-orm/sqlite-core";

export const timestamp = (name: string) =>
  text(name)
    .notNull()
    .$defaultFn(() => new Date().toISOString());
