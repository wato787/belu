import { createFileRoute, redirect } from "@tanstack/react-router";

import { Login } from "../features/auth/Login";
import { authClient } from "../lib/authClient";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (session.data?.session) {
      throw redirect({
        to: "/spaces",
      });
    }
  },
  component: Login,
});
