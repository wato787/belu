import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { LoginPage, type AuthMode } from "../features/auth";
import { authClient } from "../lib/authClient";

const Login = () => {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    email,
    mode: submittedMode,
    name,
    password,
  }: {
    email: string;
    mode: AuthMode;
    name: string;
    password: string;
  }) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result =
        submittedMode === "sign-in"
          ? await authClient.signIn.email({
              email,
              password,
            })
          : await authClient.signUp.email({
              email,
              name,
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
    <LoginPage
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      mode={mode}
      onModeChange={(nextMode) => {
        setErrorMessage(null);
        setMode(nextMode);
      }}
      onSubmit={handleSubmit}
    />
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
