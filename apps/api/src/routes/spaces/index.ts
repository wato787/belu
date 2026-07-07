import { createRoute } from "../../helpers/create-route";
import { createSpaceRoute } from "./create-space";
import { deleteSpaceRoute } from "./delete-space";
import { getSpaceRoute } from "./get-space";
import { spaceInvitesRoute } from "./invites";
import { listSpacesRoute } from "./list-spaces";
import { membersRoute } from "./members";
import { petsRoute } from "./pets";
import { postsRoute } from "./posts";
import { updateSpaceRoute } from "./update-space";

const spacesRoute = createRoute()
  .route("/", createSpaceRoute)
  .route("/", listSpacesRoute)
  .route("/", getSpaceRoute)
  .route("/", updateSpaceRoute)
  .route("/", deleteSpaceRoute)
  .route("/:spaceId/invites", spaceInvitesRoute)
  .route("/:spaceId/members", membersRoute)
  .route("/:spaceId/pets", petsRoute)
  .route("/:spaceId/posts", postsRoute);

export { spacesRoute };
