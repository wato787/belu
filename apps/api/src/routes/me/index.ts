import { createRoute } from "../../helpers/create-route";
import { getMeRoute } from "./get-me";

const meRoute = createRoute();

meRoute.route("/", getMeRoute);

export { meRoute };
