import { createFileRoute } from "@tanstack/react-router";

import { petsQueries } from "../../features/pets/queries";
import { CreatePost } from "../../features/posts/CreatePost/CreatePost";

const CreatePostRoute = () => {
  const { spaceId } = Route.useParams();

  return <CreatePost spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/posts_/new")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(petsQueries.list(params.spaceId)),
  component: CreatePostRoute,
});
