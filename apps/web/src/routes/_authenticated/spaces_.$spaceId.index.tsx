import { createFileRoute } from "@tanstack/react-router";

import { postsQueries, Timeline } from "../../features";

const TimelineRoute = () => {
  const { spaceId } = Route.useParams();

  return <Timeline spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postsQueries.list(params.spaceId)),
  component: TimelineRoute,
});
