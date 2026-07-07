import { createRoute } from "../helpers/create-route";
import { invitesRoute } from "./invites";
import { spacesRoute } from "./spaces";

const routes = createRoute();

routes.route("/invites", invitesRoute);
routes.route("/spaces", spacesRoute);

export { routes };
