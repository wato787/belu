import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { timestamp } from "../helpers/timestamp";
import { v7 as uuidv7 } from "uuid";
import { member, organization } from "./auth";
import { pets } from "./pets";
import { photos } from "./photos";
import { reactions } from "./reactions";

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$defaultFn(uuidv7),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  memberId: text("member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const postPets = sqliteTable(
  "post_pets",
  {
    id: text("id").primaryKey().$defaultFn(uuidv7),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    petId: text("pet_id")
      .notNull()
      .references(() => pets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [uniqueIndex("post_pets_post_id_pet_id_unique").on(table.postId, table.petId)],
);

export const postsRelations = relations(posts, ({ many, one }) => ({
  member: one(member, {
    fields: [posts.memberId],
    references: [member.id],
  }),
  organization: one(organization, {
    fields: [posts.organizationId],
    references: [organization.id],
  }),
  photos: many(photos),
  postPets: many(postPets),
  reactions: many(reactions),
}));

export const postPetsRelations = relations(postPets, ({ one }) => ({
  pet: one(pets, {
    fields: [postPets.petId],
    references: [pets.id],
  }),
  post: one(posts, {
    fields: [postPets.postId],
    references: [posts.id],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostPet = typeof postPets.$inferSelect;
export type NewPostPet = typeof postPets.$inferInsert;
