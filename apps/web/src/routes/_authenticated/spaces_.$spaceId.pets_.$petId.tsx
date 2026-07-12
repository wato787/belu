import { createFileRoute } from "@tanstack/react-router";

import { PetDetail } from "../../features/pets";

const PetDetailRoute = () => {
  const { petId, spaceId } = Route.useParams();

  return <PetDetail petId={petId} spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/pets_/$petId")({
  component: PetDetailRoute,
});
