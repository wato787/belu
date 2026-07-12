import { createFileRoute } from "@tanstack/react-router";

import { SpaceDetail } from "../../features";

export const Route = createFileRoute("/_authenticated/spaces_/$spaceId/")({
  component: SpaceDetail,
});
