import { createFileRoute } from "@tanstack/react-router";

import { invitesQueries } from "../../features/invites/queries";
import { SpaceMembers } from "../../features/members/SpaceMembers/SpaceMembers";
import { membersQueries } from "../../features/members/queries";

const SpaceMembersRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpaceMembers spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/members")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersQueries.list(params.spaceId)),
      context.queryClient.ensureQueryData(invitesQueries.list(params.spaceId)),
    ]),
  component: SpaceMembersRoute,
});
