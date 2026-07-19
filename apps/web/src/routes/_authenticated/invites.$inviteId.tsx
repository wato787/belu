import { createFileRoute } from "@tanstack/react-router";

import { InviteDetail } from "../../features/invites/InviteDetail/InviteDetail";
import { invitesQueries } from "../../features/invites/queries";
import { meQueries } from "../../features/me/queries";

const InviteDetailRoute = () => {
  const { inviteId } = Route.useParams();

  return <InviteDetail inviteId={inviteId} />;
};

export const Route = createFileRoute("/_authenticated/invites/$inviteId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(invitesQueries.detail(params.inviteId)),
      context.queryClient.ensureQueryData(meQueries.current()),
    ]),
  component: InviteDetailRoute,
});
