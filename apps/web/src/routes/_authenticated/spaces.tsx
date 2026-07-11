import { createFileRoute } from "@tanstack/react-router";

import { Spaces, spacesQueries } from "../../features/spaces";

export const Route = createFileRoute("/_authenticated/spaces")({
  loader: ({ context }) => context.queryClient.ensureQueryData(spacesQueries.list()),
  component: Spaces,
});
