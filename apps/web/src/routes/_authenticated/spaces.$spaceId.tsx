import { createFileRoute } from "@tanstack/react-router";

function SpaceDetail() {
  const { spaceId } = Route.useParams();

  return (
    <main>
      <h1>Space</h1>
      <p>{spaceId}</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces/$spaceId")({
  component: SpaceDetail,
});
