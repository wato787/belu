import { getConfig } from "../../config";
import { createRoute } from "../../helpers/create-route";
import { createWebPush } from "../../web-push";

const getPushPublicKeyRoute = createRoute().get("/", (c) => {
  const config = getConfig(c.env);
  const webPush = createWebPush(config.webPush);

  return c.json({ publicKey: webPush.getPublicKey() }, 200);
});

export { getPushPublicKeyRoute };
