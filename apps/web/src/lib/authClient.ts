import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getAuthBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:5173";
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [organizationClient()],
});

export type AuthSession = typeof authClient.$Infer.Session;
