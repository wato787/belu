import { zValidator } from "@hono/zod-validator";
import { createRoute } from "../../../helpers/create-route";
import { createAuth } from "../../../lib/better-auth";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceOwner } from "../../../middleware/space";
import { formatInvite } from "../../invites/helpers";
import { createInviteSchema } from "./schema";

const createInviteRoute = createRoute().post(
  "/",
  requireUser,
  requireSpaceOwner,
  zValidator("json", createInviteSchema),
  async (c) => {
    const spaceId = c.req.param("spaceId");
    const body = c.req.valid("json");
    const auth = createAuth(c.env);

    const invite = await auth.api.createInvitation({
      body: {
        email: body.email,
        organizationId: spaceId,
        role: "member",
      },
      headers: c.req.raw.headers,
    });

    return c.json({ invite: formatInvite(invite) }, 201);
  },
);

export { createInviteRoute };
