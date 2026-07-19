import { createFileRoute } from "@tanstack/react-router";

import { Spaces } from "../../features/spaces/Spaces/Spaces";
import { spacesQueries } from "../../features/spaces/queries";

export const Route = createFileRoute("/_authenticated/spaces")({
  loader: ({ context }) => context.queryClient.ensureQueryData(spacesQueries.list()),
  component: Spaces,
});
