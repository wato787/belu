import { zValidator } from "@hono/zod-validator";
import { createDb } from "../../db/client";
import { createPushSubscriptionRepository } from "../../db/repositories";
import { createRoute } from "../../helpers/create-route";
import { getRequiredUser, requireUser } from "../../middleware/auth";
import { createPushSubscriptionSchema } from "./schema";

const createPushSubscriptionRoute = createRoute().post(
  "/",
  requireUser,
  zValidator("json", createPushSubscriptionSchema),
  async (c) => {
    const user = getRequiredUser(c);
    const body = c.req.valid("json");
    const db = createDb(c.env.DB);
    const pushSubscriptionRepository = createPushSubscriptionRepository(db);
    const pushSubscription = await pushSubscriptionRepository.upsert({
      auth: body.keys.auth,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      userId: user.id,
    });

    return c.json({ pushSubscription: { id: pushSubscription?.id ?? null } }, 201);
  },
);

export { createPushSubscriptionRoute };
