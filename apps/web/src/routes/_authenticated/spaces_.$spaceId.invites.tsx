import { createFileRoute } from "@tanstack/react-router";

import { Invites } from "../../features/spaces/Invites/Invites";

const InvitesRoute = () => {
  const { spaceId } = Route.useParams();

  return <Invites spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/invites")({
  component: InvitesRoute,
});
