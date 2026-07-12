import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../../helpers/create-route";
import { NotFoundException } from "../../../helpers/exceptions";
import { createAuth } from "../../../lib/better-auth";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceOwner } from "../../../middleware/space";
import { formatInvite } from "../../invites/helpers";
import { inviteIdParamSchema } from "./schema";

const deleteInviteRoute = createRoute().delete(
  "/:inviteId",
  requireUser,
  requireSpaceOwner,
  zValidator("param", inviteIdParamSchema),
  async (c) => {
    const spaceId = c.req.param("spaceId");
    const { inviteId } = c.req.valid("param");
    const auth = createAuth(c.env);

    const invites = await auth.api.listInvitations({
      headers: c.req.raw.headers,
      query: {
        organizationId: spaceId,
      },
    });
    const existingInvite = invites.find((invite) => invite.id === inviteId);

    if (!existingInvite) {
      throw new NotFoundException("Invite Not Found");
    }

    const invite = await auth.api.cancelInvitation({
      body: {
        invitationId: inviteId,
      },
      headers: c.req.raw.headers,
    });

    if (!invite) {
      throw new NotFoundException("Invite Not Found");
    }

    return c.json({ invite: formatInvite(invite) }, 200);
  },
);

export { deleteInviteRoute };
