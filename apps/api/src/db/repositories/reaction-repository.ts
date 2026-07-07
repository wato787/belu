import { and, eq } from "drizzle-orm";
import type { Db } from "../client";
import { reactions, type NewReaction, type Reaction } from "../schema";

type ReactionIdentity = Pick<Reaction, "memberId" | "postId" | "type">;
type CreateReactionInput = Pick<NewReaction, "memberId" | "postId" | "type">;

export type ReactionRepository = {
  create: (input: CreateReactionInput) => Promise<void>;
  delete: (input: ReactionIdentity) => Promise<void>;
};

export const createReactionRepository = (db: Db): ReactionRepository => ({
  create: async (input) => {
    await db
      .insert(reactions)
      .values(input)
      .onConflictDoNothing({
        target: [reactions.postId, reactions.memberId, reactions.type],
      });
  },

  delete: async (input) => {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.postId, input.postId),
          eq(reactions.memberId, input.memberId),
          eq(reactions.type, input.type),
        ),
      );
  },
});
