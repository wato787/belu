import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { authClient } from "../lib/authClient";

type AuthMode = "sign-in" | "sign-up";

function Login() {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result =
        mode === "sign-in"
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

  const isSignUp = mode === "sign-up";

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1>Belu</h1>
          <p>{isSignUp ? "Create your account" : "Sign in to continue"}</p>
        </div>

        {isSignUp ? (
          <label>
            Name
            <input
              autoComplete="name"
              name="name"
              onChange={(event) => setName(event.currentTarget.value)}
              required
              type="text"
              value={name}
            />
          </label>
        ) : null}

        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            name="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </button>

        <button
          className="auth-switch"
          onClick={() => {
            setErrorMessage(null);
            setMode(isSignUp ? "sign-in" : "sign-up");
          }}
          type="button"
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </form>
    </main>
  );
}

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
