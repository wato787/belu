import { createFileRoute } from "@tanstack/react-router";

function SpaceInvites() {
  const { spaceId } = Route.useParams();

  return (
    <main>
      <h1>Invites</h1>
      <p>{spaceId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/invites")({
  component: SpaceInvites,
});
