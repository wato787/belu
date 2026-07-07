import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../helpers/create-route";
import { createAuth } from "../../lib/better-auth";
import { requireUser } from "../../middleware/auth";
import { formatInvite, formatInviteMember } from "./helpers";
import { inviteIdParamSchema } from "./schema";

const acceptInviteRoute = createRoute().post(
  "/:inviteId/accept",
  requireUser,
  zValidator("param", inviteIdParamSchema),
  async (c) => {
    const { inviteId } = c.req.valid("param");
    const auth = createAuth(c.env);

    const result = await auth.api.acceptInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: c.req.raw.headers,
    });

    return c.json({
      invite: formatInvite(result.invitation),
      member: formatInviteMember(result.member),
    });
  },
);

export { acceptInviteRoute };
