import { createFileRoute } from "@tanstack/react-router";

import { SpacePosts } from "../../features/posts";

const SpacePostsRoute = () => {
  const { spaceId } = Route.useParams();

  return <SpacePosts spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/posts")({
  component: SpacePostsRoute,
});
