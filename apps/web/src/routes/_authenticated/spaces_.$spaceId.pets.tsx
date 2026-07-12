import { createFileRoute } from "@tanstack/react-router";

import { SpacePets } from "../../features/pets";

const SpacePetsRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpacePets spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/pets")({
  component: SpacePetsRoute,
});
