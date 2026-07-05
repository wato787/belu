import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "../helpers/timestamp";
import { v7 as uuidv7 } from "uuid";
import { posts } from "./posts";

export const photos = sqliteTable("photos", {
  id: text("id").primaryKey().$defaultFn(uuidv7),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const photosRelations = relations(photos, ({ one }) => ({
  post: one(posts, {
    fields: [photos.postId],
    references: [posts.id],
  }),
}));

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
