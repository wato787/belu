import { createFileRoute } from "@tanstack/react-router";

function PetDetail() {
  const { petId, spaceId } = Route.useParams();

  return (
    <main>
      <h1>Pet</h1>
      <p>
        {spaceId} / {petId}
      </p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/pets/$petId")({
  component: PetDetail,
});
