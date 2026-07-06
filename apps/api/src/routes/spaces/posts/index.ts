import { createRoute } from "../../../helpers/create-route";
import { createPostRoute } from "./create-post";
import { deletePostRoute } from "./delete-post";
import { getPostRoute } from "./get-post";
import { listPostsRoute } from "./list-posts";
import { photosRoute } from "./photos";
import { updatePostRoute } from "./update-post";

const postsRoute = createRoute();

postsRoute.route("/", listPostsRoute);
postsRoute.route("/", createPostRoute);
postsRoute.route("/:postId/photos", photosRoute);
postsRoute.route("/", getPostRoute);
postsRoute.route("/", updatePostRoute);
postsRoute.route("/", deletePostRoute);

export { postsRoute };
