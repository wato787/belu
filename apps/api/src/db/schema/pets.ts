import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "../helpers/timestamp";
import { v7 as uuidv7 } from "uuid";
import { organization } from "./auth";
import { postPets } from "./posts";

export const pets = sqliteTable("pets", {
  id: text("id").primaryKey().$defaultFn(uuidv7),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const petsRelations = relations(pets, ({ many }) => ({
  postPets: many(postPets),
}));
