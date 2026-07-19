self.addEventListener("push", (event) => {
  const payload = event.data?.json() ?? {};
  const title = payload.title ?? "新しい通知があります";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body,
      data: {
        url: payload.url ?? "/spaces",
      },
      tag: payload.tag,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = new URL(event.notification.data?.url ?? "/spaces", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
      const client = clients.find((currentClient) => currentClient.url === url);

      if (client) {
        return client.focus();
      }

      return self.clients.openWindow(url);
    }),
  );
});
