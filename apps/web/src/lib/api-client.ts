import { hc } from "hono/client";
import type { AppType } from "../../../api/src";

export const apiClient = hc<AppType>("/api", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});