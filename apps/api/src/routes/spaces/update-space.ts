import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { ForbiddenException, NotFoundException } from "../../helpers/exceptions";
import { createAuth } from "../../lib/better-auth";
import { getRequiredUser, requireUser } from "../../middleware/auth";
import { spaceIdParamSchema, updateSpaceSchema } from "./schema";

const updateSpaceRoute = createRoute();

updateSpaceRoute.patch(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  zValidator("json", updateSpaceSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const user = getRequiredUser(c);
    const auth = createAuth(c.env);
    const currentSpace = await auth.api.getFullOrganization({
      headers: c.req.raw.headers,
      query: {
        organizationId: spaceId,
      },
    });

    if (!currentSpace) {
      throw new NotFoundException("Space Not Found");
    }

    const ownerMember = currentSpace.members.find(
      (member) => member.userId === user.id && member.role === "owner",
    );

    if (!ownerMember) {
      throw new ForbiddenException();
    }

    const space = await auth.api.updateOrganization({
      body: {
        organizationId: spaceId,
        data: {
          name: body.name,
          logo: body.logo,
        },
      },
      headers: c.req.raw.headers,
    });

    if (!space) {
      throw new NotFoundException("Space Not Found");
    }

    return c.json({
      space: {
        id: space.id,
        name: space.name,
        slug: space.slug,
        createdAt: space.createdAt,
        logo: space.logo ?? null,
      },
    });
  },
);

export { updateSpaceRoute };
