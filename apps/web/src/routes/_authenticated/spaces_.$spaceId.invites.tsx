import { createFileRoute } from "@tanstack/react-router";

import { SpaceInvites } from "../../features/spaces";

const SpaceInvitesRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpaceInvites spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/invites")({
  component: SpaceInvitesRoute,
});
