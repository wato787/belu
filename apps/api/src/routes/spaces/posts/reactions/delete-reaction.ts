import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../../../db/client";
import { createPostRepository, createReactionRepository } from "../../../../db/repositories";
import { createRoute } from "../../../../helpers/create-route";
import { NotFoundException } from "../../../../helpers/exceptions";
import { requireUser } from "../../../../middleware/auth";
import { requireSpaceMember } from "../../../../middleware/space";
import { spaceIdParamSchema } from "../../schema";
import { postIdParamSchema, reactionTypeParamSchema } from "../schema";

const deleteReactionRoute = createRoute().delete(
  "/:type",
  requireUser,
  zValidator("param", spaceIdParamSchema.merge(postIdParamSchema).merge(reactionTypeParamSchema)),
  requireSpaceMember,
  async (c) => {
    const { postId, spaceId, type } = c.req.valid("param");
    const spaceMember = c.get("spaceMember");
    const db = createDb(c.env.DB);
    const postRepository = createPostRepository(db);
    const reactionRepository = createReactionRepository(db);
    const post = await postRepository.findByIdAndSpaceId({
      id: postId,
      organizationId: spaceId,
      viewerMemberId: spaceMember.id,
    });

    if (!post) {
      throw new NotFoundException("Post Not Found");
    }

    await reactionRepository.delete({
      memberId: spaceMember.id,
      postId,
      type,
    });

    return c.json({
      reaction: {
        postId,
        reacted: false,
        type,
      },
    });
  },
);

export { deleteReactionRoute };
