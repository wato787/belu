import { hc } from "hono/client";
import type { ClientResponse } from "hono/client";
import type { AppType } from "../../../api/src";
import { HTTP_STATUS } from "../constants";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export const apiClient = hc<AppType>(apiBaseUrl, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});

export const parseApiResponse = async <T>(response: ClientResponse<T> | Response): Promise<T> => {
  if (!response.ok) {
    let message = response.statusText || "API request failed";

    try {
      const body = (await response.clone().json()) as unknown;
      if (
        body !== null &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text.slice(0, 500);
      }
    }

    throw new ApiRequestError(response.status, message);
  }

  if (response.status === HTTP_STATUS.NO_CONTENT) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
