import { createRoute } from "../../helpers/create-route";
import { acceptInviteRoute } from "./accept-invite";
import { getInviteRoute } from "./get-invite";
import { rejectInviteRoute } from "./reject-invite";

const invitesRoute = createRoute()
  .route("/", getInviteRoute)
  .route("/", acceptInviteRoute)
  .route("/", rejectInviteRoute);

export { invitesRoute };
