import { createRoute } from "../../../helpers/create-route";
import { createAuth } from "../../../lib/better-auth";
import { requireUser } from "../../../middleware/auth";
import { requireSpaceOwner } from "../../../middleware/space";
import { formatSpaceMember } from "./helpers";

const listMembersRoute = createRoute().get("/", requireUser, requireSpaceOwner, async (c) => {
  const spaceId = c.req.param("spaceId");
  const auth = createAuth(c.env);

  const result = await auth.api.listMembers({
    headers: c.req.raw.headers,
    query: {
      organizationId: spaceId,
    },
  });

  return c.json(
    {
      members: result.members.map((member) => formatSpaceMember(member)),
      total: result.total,
    },
    200,
  );
});

export { listMembersRoute };
