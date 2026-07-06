import { createRoute } from "../../../../helpers/create-route";
import { createPhotoRoute } from "./create-photo";

const photosRoute = createRoute();

photosRoute.route("/", createPhotoRoute);

export { photosRoute };
