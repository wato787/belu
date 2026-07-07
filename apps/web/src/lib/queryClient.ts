import { QueryClient } from "@tanstack/react-query";
import { HTTP_STATUS, isClientErrorStatus } from "../constants";
import { ApiRequestError } from "./apiClient";

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (failureCount >= 2) {
    return false;
  }

  if (error instanceof ApiRequestError) {
    if (error.status === HTTP_STATUS.UNAUTHORIZED || error.status === HTTP_STATUS.FORBIDDEN) {
      return false;
    }

    if (isClientErrorStatus(error.status)) {
      return false;
    }
  }

  return true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      staleTime: 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});
