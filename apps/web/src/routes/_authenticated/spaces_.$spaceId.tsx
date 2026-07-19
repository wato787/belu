import { createFileRoute, Outlet } from "@tanstack/react-router";

import { meQueries } from "../../features/me/queries";
import { petsQueries } from "../../features/pets/queries";
import { SpaceLayout } from "../../features/spaces/SpaceLayout/SpaceLayout";
import { spacesQueries } from "../../features/spaces/queries";

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
      context.queryClient.ensureQueryData(petsQueries.list(params.spaceId)),
    ]),
  component: SpaceLayoutRoute,
});
