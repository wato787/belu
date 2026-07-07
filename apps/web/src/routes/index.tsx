import { createFileRoute } from "@tanstack/react-router";

function Home() {
  return (
    <main>
      <h1>Belu</h1>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
