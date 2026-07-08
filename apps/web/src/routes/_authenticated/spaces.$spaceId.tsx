import { createFileRoute } from "@tanstack/react-router";

import { SpaceDetail } from "../../features/spaces";

const SpaceDetailRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpaceDetail spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces/$spaceId")({
  component: SpaceDetailRoute,
});
