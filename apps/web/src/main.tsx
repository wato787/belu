import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function Home() {
  const [health, setHealth] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/health", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        const data = (await response.json()) as { status?: string };
        setHealth(data.status === "ok" ? "ok" : "error");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setHealth("error");
      });

    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Belu</h1>
      <p>API health: {health}</p>
    </main>
  );
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
