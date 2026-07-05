import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { timestamp } from "../helpers/timestamp";
import { v7 as uuidv7 } from "uuid";
import { member } from "./auth";
import { posts } from "./posts";

export const reactions = sqliteTable(
  "reactions",
  {
    id: text("id").primaryKey().$defaultFn(uuidv7),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("reactions_post_id_member_id_type_unique").on(
      table.postId,
      table.memberId,
      table.type,
    ),
  ],
);

export const reactionsRelations = relations(reactions, ({ one }) => ({
  member: one(member, {
    fields: [reactions.memberId],
    references: [member.id],
  }),
  post: one(posts, {
    fields: [reactions.postId],
    references: [posts.id],
  }),
}));

export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;
