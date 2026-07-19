import { createRoute } from "../../helpers/create-route";
import { getPushPublicKeyRoute } from "./public-key";
import { createPushSubscriptionRoute } from "./subscriptions";

const pushRoute = createRoute()
  .route("/public-key", getPushPublicKeyRoute)
  .route("/subscriptions", createPushSubscriptionRoute);

export { pushRoute };
