import { createRoute } from "../../../helpers/create-route";
import { createPostRoute } from "./create-post";
import { createPostUploadUrlRoute } from "./create-post-upload-url";
import { deletePostRoute } from "./delete-post";
import { getPostRoute } from "./get-post";
import { listPostsRoute } from "./list-posts";
import { updatePostRoute } from "./update-post";

const postsRoute = createRoute();

postsRoute.route("/", listPostsRoute);
postsRoute.route("/", createPostUploadUrlRoute);
postsRoute.route("/", createPostRoute);
postsRoute.route("/", getPostRoute);
postsRoute.route("/", updatePostRoute);
postsRoute.route("/", deletePostRoute);

export { postsRoute };
