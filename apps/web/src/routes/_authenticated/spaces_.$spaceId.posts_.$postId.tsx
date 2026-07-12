import { createFileRoute } from "@tanstack/react-router";

import { PostDetail } from "../../features/posts";

const PostDetailRoute = () => {
  const { postId, spaceId } = Route.useParams();

  return <PostDetail postId={postId} spaceId={spaceId} />;
};

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/posts_/$postId")({
  component: PostDetailRoute,
});
