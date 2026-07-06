import { and, eq, inArray } from "drizzle-orm";
import type { Db } from "../client";
import {
  pets,
  photos,
  postPets,
  posts,
  type NewPost,
  type Pet,
  type Photo,
  type Post,
} from "../schema";

type PostSpaceKey = Pick<Post, "organizationId">;
type PostIdentity = Pick<Post, "id" | "organizationId">;
type CreatePostInput = Pick<NewPost, "body" | "memberId" | "organizationId"> & {
  petIds: Pet["id"][];
};
type UpdatePostInput = Pick<Post, "id" | "organizationId"> & {
  body?: Post["body"];
  petIds?: Pet["id"][];
};
type PostPetInput = Pick<Post, "organizationId"> & {
  petIds: Pet["id"][];
};

export type PostWithPets = Post & {
  photos: Photo[];
  pets: Pet[];
};

export type PostRepository = {
  listBySpaceId: (input: PostSpaceKey) => Promise<PostWithPets[]>;
  create: (input: CreatePostInput) => Promise<PostWithPets | undefined>;
  findByIdAndSpaceId: (input: PostIdentity) => Promise<PostWithPets | undefined>;
  updateByIdAndSpaceId: (input: UpdatePostInput) => Promise<PostWithPets | undefined>;
  deleteByIdAndSpaceId: (input: PostIdentity) => Promise<Post | undefined>;
  countPetsBySpaceId: (input: PostPetInput) => Promise<number>;
};

const attachRelations = async (db: Db, spacePosts: Post[]): Promise<PostWithPets[]> => {
  if (spacePosts.length === 0) {
    return [];
  }

  const postIds = spacePosts.map((post) => post.id);
  const petRows = await db
    .select({
      pet: pets,
      postId: postPets.postId,
    })
    .from(postPets)
    .innerJoin(pets, eq(pets.id, postPets.petId))
    .where(inArray(postPets.postId, postIds));
  const photoRows = await db.select().from(photos).where(inArray(photos.postId, postIds));

  return spacePosts.map((post) => ({
    ...post,
    photos: photoRows.filter((photo) => photo.postId === post.id),
    pets: petRows.filter((row) => row.postId === post.id).map((row) => row.pet),
  }));
};

export const createPostRepository = (db: Db): PostRepository => ({
  listBySpaceId: async (input) => {
    const spacePosts = await db
      .select()
      .from(posts)
      .where(eq(posts.organizationId, input.organizationId));

    return attachRelations(db, spacePosts);
  },

  create: async (input) => {
    const [post] = await db
      .insert(posts)
      .values({
        body: input.body,
        memberId: input.memberId,
        organizationId: input.organizationId,
      })
      .returning();

    if (!post) {
      return undefined;
    }

    if (input.petIds.length > 0) {
      await db.insert(postPets).values(
        input.petIds.map((petId) => ({
          petId,
          postId: post.id,
        })),
      );
    }

    return createPostRepository(db).findByIdAndSpaceId({
      id: post.id,
      organizationId: input.organizationId,
    });
  },

  findByIdAndSpaceId: async (input) => {
    const post = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, input.id), eq(posts.organizationId, input.organizationId)))
      .get();

    if (!post) {
      return undefined;
    }

    const [postWithPets] = await attachRelations(db, [post]);

    return postWithPets;
  },

  updateByIdAndSpaceId: async (input) => {
    const [post] = await db
      .update(posts)
      .set({
        ...(input.body === undefined ? {} : { body: input.body }),
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(posts.id, input.id), eq(posts.organizationId, input.organizationId)))
      .returning();

    if (!post) {
      return undefined;
    }

    if (input.petIds !== undefined) {
      await db.delete(postPets).where(eq(postPets.postId, post.id));

      if (input.petIds.length > 0) {
        await db.insert(postPets).values(
          input.petIds.map((petId) => ({
            petId,
            postId: post.id,
          })),
        );
      }
    }

    return createPostRepository(db).findByIdAndSpaceId({
      id: post.id,
      organizationId: input.organizationId,
    });
  },

  deleteByIdAndSpaceId: async (input) => {
    const [post] = await db
      .delete(posts)
      .where(and(eq(posts.id, input.id), eq(posts.organizationId, input.organizationId)))
      .returning();

    return post;
  },

  countPetsBySpaceId: async (input) => {
    if (input.petIds.length === 0) {
      return 0;
    }

    const spacePets = await db
      .select({ id: pets.id })
      .from(pets)
      .where(and(eq(pets.organizationId, input.organizationId), inArray(pets.id, input.petIds)));

    return spacePets.length;
  },
});
