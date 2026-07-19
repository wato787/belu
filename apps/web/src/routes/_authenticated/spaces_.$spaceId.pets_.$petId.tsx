import { createFileRoute } from "@tanstack/react-router";

import { PetEdit } from "../../features/pets/PetEdit/PetEdit";
import { petsQueries } from "../../features/pets/queries";

const PetEditRoute = () => {
  const { petId, spaceId } = Route.useParams();

  return <PetEdit petId={petId} spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/pets_/$petId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(petsQueries.detail(params.spaceId, params.petId)),
  component: PetEditRoute,
});
