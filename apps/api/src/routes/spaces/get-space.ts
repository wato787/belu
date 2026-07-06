import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { NotFoundException } from "../../helpers/exceptions";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { spaceIdParamSchema } from "./schema";

const getSpaceRoute = createRoute();

getSpaceRoute.get("/:spaceId", requireUser, zValidator("param", spaceIdParamSchema), async (c) => {
  const { spaceId } = c.req.valid("param");
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

  return c.json({
    space: {
      id: space.id,
      name: space.name,
      slug: space.slug,
      createdAt: space.createdAt,
      logo: space.logo ?? null,
    },
  });
});

export { getSpaceRoute };
