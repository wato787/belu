import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../../helpers/create-route";
import { BadRequestException, NotFoundException } from "../../../helpers/exceptions";
import { createAuth } from "../../../lib/better-auth";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceOwner } from "../../../middleware/space";
import { formatSpaceMember } from "./helpers";
import { memberIdParamSchema } from "./schema";

const deleteMemberRoute = createRoute();

deleteMemberRoute.delete(
  "/:memberId",
  requireUser,
  requireSpaceOwner,
  zValidator("param", memberIdParamSchema),
  async (c) => {
    const spaceId = c.req.param("spaceId");
    const ownerMember = c.get("spaceMember");
    const { memberId } = c.req.valid("param");
    const auth = createAuth(c.env);

    if (memberId === ownerMember.id) {
      throw new BadRequestException("Cannot remove yourself");
    }

    const result = await auth.api.listMembers({
      headers: c.req.raw.headers,
      query: {
        organizationId: spaceId,
      },
    });
    const member = result.members.find((item) => item.id === memberId);

    if (!member) {
      throw new NotFoundException("Member Not Found");
    }

    await auth.api.removeMember({
      body: {
        memberIdOrEmail: memberId,
        organizationId: spaceId,
      },
      headers: c.req.raw.headers,
    });

    return c.json({ member: formatSpaceMember(member) });
  },
);

export { deleteMemberRoute };
