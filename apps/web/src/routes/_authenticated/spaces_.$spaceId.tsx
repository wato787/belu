import { createFileRoute, Outlet } from "@tanstack/react-router";

import { meQueries, SpaceLayout, spacesQueries } from "../../features";

const SpaceLayoutRoute = () => {
  const { spaceId } = Route.useParams();

  return (
    <SpaceLayout spaceId={spaceId}>
      <Outlet />
    </SpaceLayout>
  );
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(spacesQueries.detail(params.spaceId)),
      context.queryClient.ensureQueryData(meQueries.current()),
    ]),
  component: SpaceLayoutRoute,
});
