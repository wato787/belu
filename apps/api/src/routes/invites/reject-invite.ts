import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { formatInvite } from "./helpers";
import { inviteIdParamSchema } from "./schema";

const rejectInviteRoute = createRoute().post(
  "/:inviteId/reject",
  requireUser,
  zValidator("param", inviteIdParamSchema),
  async (c) => {
    const { inviteId } = c.req.valid("param");
    const auth = createAuth(c.env);

    const result = await auth.api.rejectInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: c.req.raw.headers,
    });

    return c.json({
      invite: result.invitation ? formatInvite(result.invitation) : null,
      member: result.member,
    });
  },
);

export { rejectInviteRoute };
