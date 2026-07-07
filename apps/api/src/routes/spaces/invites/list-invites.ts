import { createRoute } from "../../../helpers/create-route";
import { createAuth } from "../../../lib/better-auth";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceOwner } from "../../../middleware/space";
import { formatInvite } from "../../invites/helpers";

const listInvitesRoute = createRoute();

listInvitesRoute.get("/", requireUser, requireSpaceOwner, async (c) => {
  const spaceId = c.req.param("spaceId");
  const auth = createAuth(c.env);

  const invites = await auth.api.listInvitations({
    headers: c.req.raw.headers,
    query: {
      organizationId: spaceId,
    },
  });

  return c.json({
    invites: invites.map((invite) => formatInvite(invite)),
  });
});

export { listInvitesRoute };
