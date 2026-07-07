import { createRoute } from "../../../../helpers/create-route";
import { deleteReactionRoute } from "./delete-reaction";
import { putReactionRoute } from "./put-reaction";

const reactionsRoute = createRoute();

reactionsRoute.route("/", putReactionRoute);
reactionsRoute.route("/", deleteReactionRoute);

export { reactionsRoute };
