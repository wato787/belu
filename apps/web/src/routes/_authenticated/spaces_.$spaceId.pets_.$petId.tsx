import { createFileRoute, redirect } from "@tanstack/react-router";

import { petsQueries } from "../../features/pets";

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/pets_/$petId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(petsQueries.detail(params.spaceId, params.petId)),
  beforeLoad: ({ params }) => {
    throw redirect({
      params,
      to: "/spaces/$spaceId/pets/$petId/edit",
    });
  },
});
