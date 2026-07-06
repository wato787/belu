import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { requireUser } from "../../middleware/auth";
import { requireSpaceMember } from "../../middleware/space";
import { spaceIdParamSchema } from "./schema";

const getSpaceRoute = createRoute();

getSpaceRoute.get(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceMember,
  async (c) => {
    const space = c.get("space");

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

export { getSpaceRoute };
