import { createRoute } from "../../../helpers/create-route";
import { deleteMemberRoute } from "./delete-member";
import { listMembersRoute } from "./list-members";

const membersRoute = createRoute();

membersRoute.route("/", listMembersRoute);
membersRoute.route("/", deleteMemberRoute);

export { membersRoute };
