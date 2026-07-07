import { createFileRoute } from "@tanstack/react-router";

function Spaces() {
  return (
    <main>
      <h1>Belu</h1>
      <p>You are signed in.</p>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/spaces")({
  component: Spaces,
});
