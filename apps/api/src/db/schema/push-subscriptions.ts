import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";
import { timestamp } from "../helpers/timestamp";
import { user } from "./auth";

export const pushSubscriptions = sqliteTable(
  "push_subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(uuidv7),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    index("push_subscriptions_user_id_idx").on(table.userId),
    uniqueIndex("push_subscriptions_endpoint_unique").on(table.endpoint),
  ],
);

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(user, {
    fields: [pushSubscriptions.userId],
    references: [user.id],
  }),
}));

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;
