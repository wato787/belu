import { createFileRoute } from "@tanstack/react-router";

import { Spaces } from "../../features/spaces";

export const Route = createFileRoute("/_authenticated/spaces")({
  component: Spaces,
});
