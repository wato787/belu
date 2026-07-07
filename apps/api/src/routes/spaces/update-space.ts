import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { NotFoundException } from "../../helpers/exceptions";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { requireSpaceOwner } from "../../middleware/space";
import { spaceIdParamSchema, updateSpaceSchema } from "./schema";

const updateSpaceRoute = createRoute().patch(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceOwner,
  zValidator("json", updateSpaceSchema),
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const body = c.req.valid("json");
    const auth = createAuth(c.env);

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
