import { createFileRoute } from "@tanstack/react-router";

import { postsQueries } from "../../features/posts/queries";
import { Timeline } from "../../features/spaces/Timeline/Timeline";

const TimelineRoute = () => {
  const { spaceId } = Route.useParams();

  return <Timeline spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postsQueries.list(params.spaceId)),
  component: TimelineRoute,
});
