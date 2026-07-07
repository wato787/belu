import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "../lib/authClient";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data?.session) {
      throw redirect({
        to: "/",
      });
    }

    return {
      session: session.data,
    };
  },
  component: () => <Outlet />,
});
