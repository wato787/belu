import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { ForbiddenException, NotFoundException } from "../../helpers/exceptions";
import { createAuth } from "../../lib/better-auth";
import { getRequiredUser, requireUser } from "../../middleware/auth";
import { spaceIdParamSchema } from "./schema";

const deleteSpaceRoute = createRoute();

deleteSpaceRoute.delete(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const user = getRequiredUser(c);
    const auth = createAuth(c.env);
    const space = await auth.api.getFullOrganization({
      headers: c.req.raw.headers,
      query: {
        organizationId: spaceId,
      },
    });

    if (!space) {
      throw new NotFoundException("Space Not Found");
    }

    const ownerMember = space.members.find(
      (member) => member.userId === user.id && member.role === "owner",
    );

    if (!ownerMember) {
      throw new ForbiddenException();
    }

    await auth.api.deleteOrganization({
      body: {
        organizationId: spaceId,
      },
      headers: c.req.raw.headers,
    });

    return c.body(null, 204);
  },
);

export { deleteSpaceRoute };
