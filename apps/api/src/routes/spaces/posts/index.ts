import { createRoute } from "../../../helpers/create-route";
import { createPostRoute } from "./create-post";
import { createPostUploadUrlRoute } from "./create-post-upload-url";
import { deletePostRoute } from "./delete-post";
import { getPostRoute } from "./get-post";
import { listPostsRoute } from "./list-posts";
import { reactionsRoute } from "./reactions";
import { updatePostRoute } from "./update-post";

const postsRoute = createRoute()
  .route("/", listPostsRoute)
  .route("/", createPostUploadUrlRoute)
  .route("/", createPostRoute)
  .route("/:postId/reactions", reactionsRoute)
  .route("/", getPostRoute)
  .route("/", updatePostRoute)
  .route("/", deletePostRoute);

export { postsRoute };
