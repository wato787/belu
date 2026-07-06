import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { requireSpaceOwner } from "../../middleware/space";
import { spaceIdParamSchema } from "./schema";

const deleteSpaceRoute = createRoute();

deleteSpaceRoute.delete(
  "/:spaceId",
  requireUser,
  zValidator("param", spaceIdParamSchema),
  requireSpaceOwner,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const auth = createAuth(c.env);

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
