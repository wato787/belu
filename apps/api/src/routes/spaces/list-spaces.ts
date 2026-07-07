import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";

const listSpacesRoute = createRoute().get("/", requireUser, async (c) => {
  const auth = createAuth(c.env);
  const spaces = await auth.api.listOrganizations({
    headers: c.req.raw.headers,
  });

  return c.json({
    spaces: spaces.map((space) => ({
      id: space.id,
      name: space.name,
      slug: space.slug,
      createdAt: space.createdAt,
      logo: space.logo ?? null,
    })),
  });
});

export { listSpacesRoute };
