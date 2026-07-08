import { createFileRoute } from "@tanstack/react-router";

function SpaceMembers() {
  const { spaceId } = Route.useParams();

  return (
    <main>
      <h1>Members</h1>
      <p>{spaceId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/members")({
  component: SpaceMembers,
});
