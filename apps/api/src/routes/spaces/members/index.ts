import { createRoute } from "../../../helpers/create-route";
import { deleteMemberRoute } from "./delete-member";
import { listMembersRoute } from "./list-members";

const membersRoute = createRoute().route("/", listMembersRoute).route("/", deleteMemberRoute);

export { membersRoute };
