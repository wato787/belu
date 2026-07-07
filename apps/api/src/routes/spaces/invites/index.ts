import { createRoute } from "../../../helpers/create-route";
import { createInviteRoute } from "./create-invite";
import { deleteInviteRoute } from "./delete-invite";
import { listInvitesRoute } from "./list-invites";

const spaceInvitesRoute = createRoute()
  .route("/", listInvitesRoute)
  .route("/", createInviteRoute)
  .route("/", deleteInviteRoute);

export { spaceInvitesRoute };
