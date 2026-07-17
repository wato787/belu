import { createFileRoute } from "@tanstack/react-router";

import { EditPost, petsQueries, postsQueries } from "../../features";

const EditPostRoute = () => {
  const { postId, spaceId } = Route.useParams();

  return <EditPost postId={postId} spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/posts_/$postId_/edit")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(petsQueries.list(params.spaceId)),
      context.queryClient.ensureQueryData(postsQueries.detail(params.spaceId, params.postId)),
    ]),
  component: EditPostRoute,
});
