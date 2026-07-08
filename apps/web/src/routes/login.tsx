import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { LoginPage } from "../features/auth";
import { authClient } from "../lib/authClient";

const Login = () => {
  const router = useRouter();
  const search = Route.useSearch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setErrorMessage(result.error.message ?? "Authentication failed");
        return;
      }

      router.history.push(search.redirect ?? "/spaces");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginPage errorMessage={errorMessage} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
  );
};

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
