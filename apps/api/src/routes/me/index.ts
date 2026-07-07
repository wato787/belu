import { createRoute } from "../../helpers/create-route";
import { getMeRoute } from "./get-me";

const meRoute = createRoute().route("/", getMeRoute);

export { meRoute };
