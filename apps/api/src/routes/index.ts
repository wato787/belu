import { createRoute } from "../helpers/create-route";
import { invitesRoute } from "./invites";
import { meRoute } from "./me";
import { spacesRoute } from "./spaces";

const routes = createRoute()
  .route("/me", meRoute)
  .route("/invites", invitesRoute)
  .route("/spaces", spacesRoute);

export { routes };
