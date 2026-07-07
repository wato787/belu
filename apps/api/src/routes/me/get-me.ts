import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { getRequiredUser, requireUser } from "../../middleware/auth";
import { formatMeSpace, formatMeUser } from "./helpers";

const getMeRoute = createRoute();

getMeRoute.get("/", requireUser, async (c) => {
  const user = getRequiredUser(c);
  const auth = createAuth(c.env);

  const spaces = await auth.api.listOrganizations({
    headers: c.req.raw.headers,
  });

  return c.json({
    user: formatMeUser(user),
    spaces: spaces.map((space) => formatMeSpace(space)),
  });
});

export { getMeRoute };
