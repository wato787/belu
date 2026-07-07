import { createRoute } from "../../helpers/create-route";
import { acceptInviteRoute } from "./accept-invite";
import { getInviteRoute } from "./get-invite";
import { rejectInviteRoute } from "./reject-invite";

const invitesRoute = createRoute();

invitesRoute.route("/", getInviteRoute);
invitesRoute.route("/", acceptInviteRoute);
invitesRoute.route("/", rejectInviteRoute);

export { invitesRoute };
