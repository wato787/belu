import { createRoute } from "../../../../helpers/create-route";
import { deleteReactionRoute } from "./delete-reaction";
import { putReactionRoute } from "./put-reaction";

const reactionsRoute = createRoute().route("/", putReactionRoute).route("/", deleteReactionRoute);

export { reactionsRoute };
