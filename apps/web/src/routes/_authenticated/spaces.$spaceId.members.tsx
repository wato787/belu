import { createFileRoute } from "@tanstack/react-router";

import { SpaceMembers } from "../../features/members";

const SpaceMembersRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpaceMembers spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/members")({
  component: SpaceMembersRoute,
});
