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

const spacesRoute = createRoute();

spacesRoute.route("/", createSpaceRoute);
spacesRoute.route("/", listSpacesRoute);
spacesRoute.route("/", getSpaceRoute);
spacesRoute.route("/", updateSpaceRoute);
spacesRoute.route("/", deleteSpaceRoute);
spacesRoute.route("/:spaceId/invites", spaceInvitesRoute);
spacesRoute.route("/:spaceId/members", membersRoute);
spacesRoute.route("/:spaceId/pets", petsRoute);
spacesRoute.route("/:spaceId/posts", postsRoute);

export { spacesRoute };
