import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, parseApiResponse } from "../../lib/apiClient";

type PushPublicKeyResponse = {
  publicKey: string | null;
};

const pushNotificationEnabledMessage = "通知を有効にしました。";
const pushNotificationFailedMessage =
  "通知を有効にできませんでした。ブラウザの通知設定を確認してください。";
const pushNotificationDeniedMessage = "ブラウザで通知が拒否されています。";
const pushNotificationUnsupportedMessage = "このブラウザでは通知を利用できません。";
const pushNotificationNotConfiguredMessage = "通知設定がまだ完了していません。";

const isPushNotificationSupported = () =>
  "Notification" in window && "PushManager" in window && "serviceWorker" in navigator;

const decodeBase64Url = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const getPushPublicKey = async () => {
  const response = await apiClient.push["public-key"].$get();
  const data = await parseApiResponse<PushPublicKeyResponse>(response);

  return data.publicKey;
};

const subscribePushNotification = async (publicKey: string) => {
  const registration = await navigator.serviceWorker.register("/push-sw.js");
  const currentSubscription = await registration.pushManager.getSubscription();

  return (
    currentSubscription ??
    (await registration.pushManager.subscribe({
      applicationServerKey: decodeBase64Url(publicKey),
      userVisibleOnly: true,
    }))
  );
};

const savePushSubscription = async (subscription: PushSubscription) => {
  const subscriptionJson = subscription.toJSON();
  const auth = subscriptionJson.keys?.auth;
  const p256dh = subscriptionJson.keys?.p256dh;

  if (!subscriptionJson.endpoint || !auth || !p256dh) {
    throw new Error(pushNotificationFailedMessage);
  }

  const response = await apiClient.push.subscriptions.$post({
    json: {
      endpoint: subscriptionJson.endpoint,
      keys: {
        auth,
        p256dh,
      },
    },
  });

  await parseApiResponse(response);
};

export const useEnablePushNotifications = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      if (!isPushNotificationSupported()) {
        throw new Error(pushNotificationUnsupportedMessage);
      }

      if (Notification.permission === "denied") {
        throw new Error(pushNotificationDeniedMessage);
      }

      const permission =
        Notification.permission === "granted"
          ? Notification.permission
          : await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(pushNotificationDeniedMessage);
      }

      const publicKey = await getPushPublicKey();

      if (!publicKey) {
        throw new Error(pushNotificationNotConfiguredMessage);
      }

      const subscription = await subscribePushNotification(publicKey);
      await savePushSubscription(subscription);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : pushNotificationFailedMessage);
    },
    onSuccess: () => {
      toast.success(pushNotificationEnabledMessage);
    },
  });

  return {
    enablePushNotifications: mutation.mutate,
    isPending: mutation.isPending,
  };
};
