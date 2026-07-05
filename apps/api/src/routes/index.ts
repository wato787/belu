import { createRoute } from "../helpers/create-route";
import { spacesRoute } from "./spaces";

const routes = createRoute();

routes.route("/spaces", spacesRoute);

export { routes };
