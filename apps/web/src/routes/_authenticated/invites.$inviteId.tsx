import { createFileRoute } from "@tanstack/react-router";

import { InviteDetail } from "../../features/invites";

const InviteDetailRoute = () => {
  const { inviteId } = Route.useParams();

  return <InviteDetail inviteId={inviteId} />;
};

export const Route = createFileRoute("/_authenticated/invites/$inviteId")({
  component: InviteDetailRoute,
});
