import { createRoute } from "../helpers/create-route";
import { invitesRoute } from "./invites";
import { meRoute } from "./me";
import { spacesRoute } from "./spaces";

const routes = createRoute();

routes.route("/me", meRoute);
routes.route("/invites", invitesRoute);
routes.route("/spaces", spacesRoute);

export { routes };
