import { zValidator } from "@hono/zod-validator";
import { v7 as uuidv7 } from "uuid";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { createSpaceSchema } from "./schema";

const createSpaceRoute = createRoute();

createSpaceRoute.post("/", requireUser, zValidator("json", createSpaceSchema), async (c) => {
  const body = c.req.valid("json");
  const auth = createAuth(c.env);
  const space = await auth.api.createOrganization({
    body: {
      name: body.name,
      slug: uuidv7(),
      logo: body.logo ?? null,
    },
    headers: c.req.raw.headers,
  });

  return c.json(
    {
      space: {
        id: space.id,
        name: space.name,
        slug: space.slug,
        createdAt: space.createdAt,
        logo: space.logo ?? null,
      },
    },
    201,
  );
});

export { createSpaceRoute };
