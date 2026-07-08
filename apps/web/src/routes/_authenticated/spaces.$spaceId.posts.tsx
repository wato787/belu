import { createFileRoute } from "@tanstack/react-router";

function SpacePosts() {
  const { spaceId } = Route.useParams();

  return (
    <main>
      <h1>Posts</h1>
      <p>{spaceId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId/posts")({
  component: SpacePosts,
});
