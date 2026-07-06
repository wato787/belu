import { createRoute } from "../../helpers/create-route";
import { createSpaceRoute } from "./create-space";
import { deleteSpaceRoute } from "./delete-space";
import { getSpaceRoute } from "./get-space";
import { listSpacesRoute } from "./list-spaces";
import { petsRoute } from "./pets";
import { updateSpaceRoute } from "./update-space";

const spacesRoute = createRoute();

spacesRoute.route("/", createSpaceRoute);
spacesRoute.route("/", listSpacesRoute);
spacesRoute.route("/", getSpaceRoute);
spacesRoute.route("/", updateSpaceRoute);
spacesRoute.route("/", deleteSpaceRoute);
spacesRoute.route("/:spaceId/pets", petsRoute);

export { spacesRoute };
