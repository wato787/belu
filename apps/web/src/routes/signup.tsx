import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUp } from "../features/auth";
import { authClient } from "../lib/authClient";

export const Route = createFileRoute("/signup")({
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
  component: SignUp,
});
