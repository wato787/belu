import { createFileRoute } from "@tanstack/react-router";

function SpacePets() {
  const { spaceId } = Route.useParams();

  return (
    <main>
      <h1>Pets</h1>
      <p>{spaceId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/pets")({
  component: SpacePets,
});
