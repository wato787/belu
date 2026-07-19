import { and, eq, ne } from "drizzle-orm";
import type { Db } from "../client";
import {
  member,
  pushSubscriptions,
  type NewPushSubscription,
  type PushSubscription,
} from "../schema";

type UpsertPushSubscriptionInput = Pick<
  NewPushSubscription,
  "auth" | "endpoint" | "p256dh" | "userId"
>;
type PushSubscriptionSpaceKey = {
  excludedMemberId: string;
  organizationId: string;
};
type PushSubscriptionEndpoint = Pick<PushSubscription, "endpoint">;

export type PushSubscriptionRepository = {
  deleteByEndpoint: (input: PushSubscriptionEndpoint) => Promise<void>;
  listBySpaceIdExceptMemberId: (input: PushSubscriptionSpaceKey) => Promise<PushSubscription[]>;
  upsert: (input: UpsertPushSubscriptionInput) => Promise<PushSubscription | undefined>;
};

export const createPushSubscriptionRepository = (db: Db): PushSubscriptionRepository => ({
  deleteByEndpoint: async (input) => {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, input.endpoint));
  },

  listBySpaceIdExceptMemberId: async (input) => {
    const rows = await db
      .select({ pushSubscription: pushSubscriptions })
      .from(pushSubscriptions)
      .innerJoin(member, eq(member.userId, pushSubscriptions.userId))
      .where(
        and(eq(member.organizationId, input.organizationId), ne(member.id, input.excludedMemberId)),
      );

    return rows.map((row) => row.pushSubscription);
  },

  upsert: async (input) => {
    const [pushSubscription] = await db
      .insert(pushSubscriptions)
      .values(input)
      .onConflictDoUpdate({
        set: {
          auth: input.auth,
          p256dh: input.p256dh,
          updatedAt: new Date().toISOString(),
          userId: input.userId,
        },
        target: pushSubscriptions.endpoint,
      })
      .returning();

    return pushSubscription;
  },
});
