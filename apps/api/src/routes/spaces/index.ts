import { createRoute } from "../../helpers/create-route";
import { createSpaceRoute } from "./create-space";

const spacesRoute = createRoute();

spacesRoute.route("/", createSpaceRoute);

export { spacesRoute };
