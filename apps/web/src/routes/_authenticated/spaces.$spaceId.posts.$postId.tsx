import { createFileRoute } from "@tanstack/react-router";

function PostDetail() {
  const { postId, spaceId } = Route.useParams();

  return (
    <main>
      <h1>Post</h1>
      <p>
        {spaceId} / {postId}
      </p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/posts/$postId")({
  component: PostDetail,
});
