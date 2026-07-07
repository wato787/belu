import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { formatInvite } from "./helpers";
import { inviteIdParamSchema } from "./schema";

const getInviteRoute = createRoute();

getInviteRoute.get(
  "/:inviteId",
  requireUser,
  zValidator("param", inviteIdParamSchema),
  async (c) => {
    const { inviteId } = c.req.valid("param");
    const auth = createAuth(c.env);

    const invite = await auth.api.getInvitation({
      headers: c.req.raw.headers,
      query: {
        id: inviteId,
      },
    });

    return c.json({ invite: formatInvite(invite) });
  },
);

export { getInviteRoute };
