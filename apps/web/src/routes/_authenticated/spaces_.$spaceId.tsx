import { createFileRoute } from "@tanstack/react-router";

import { meQueries, SpaceDetail, spacesQueries } from "../../features";

const SpaceDetailRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpaceDetail spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(spacesQueries.detail(params.spaceId)),
      context.queryClient.ensureQueryData(meQueries.current()),
    ]),
  component: SpaceDetailRoute,
});
