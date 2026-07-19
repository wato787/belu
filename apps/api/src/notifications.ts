import type { AppConfig } from "./config";
import type { PushSubscriptionRepository } from "./db/repositories";
import type { PostWithPets } from "./db/repositories/post-repository";
import { logger } from "./logger";
import { createWebPush } from "./web-push";

type NotifyPostCreatedInput = {
  post: PostWithPets;
  pushSubscriptionRepository: PushSubscriptionRepository;
};

export const createNotifications = (config: AppConfig) => {
  const webPush = createWebPush(config.webPush);

  return {
    notifyPostCreated: async ({ post, pushSubscriptionRepository }: NotifyPostCreatedInput) => {
      const subscriptions = await pushSubscriptionRepository.listBySpaceIdExceptMemberId({
        excludedMemberId: post.memberId,
        organizationId: post.organizationId,
      });
      const payload = {
        body: `${post.author.name}さんが投稿しました`,
        tag: `space-${post.organizationId}-post-created`,
        title: "新しい投稿がありました",
        url: `/spaces/${post.organizationId}/posts/${post.id}`,
      };

      await Promise.all(
        subscriptions.map(async (subscription) => {
          const result = await webPush.send({ payload, subscription });

          if (result.status === "expired") {
            await pushSubscriptionRepository.deleteByEndpoint({
              endpoint: subscription.endpoint,
            });
          }

          if (result.status === "failed") {
            logger.warn("web push delivery failed", {
              status: result.statusCode,
            });
          }
        }),
      );
    },
  };
};
