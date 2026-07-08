import { createFileRoute } from "@tanstack/react-router";

function InviteDetail() {
  const { inviteId } = Route.useParams();

  return (
    <main>
      <h1>Invite</h1>
      <p>{inviteId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/invites/$inviteId")({
  component: InviteDetail,
});
