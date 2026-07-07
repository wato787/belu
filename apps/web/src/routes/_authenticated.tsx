import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "../lib/authClient";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();

    if (!session.data?.session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    return {
      session: session.data,
    };
  },
  component: () => <Outlet />,
});
