import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { meKeys } from "./keys";

type GetMeResponse = InferResponseType<typeof apiClient.me.$get, 200>;

export const meQueries = {
  current: () =>
    queryOptions({
      queryKey: meKeys.all,
      queryFn: async () => {
        const response = await apiClient.me.$get();
        const data = await parseApiResponse<GetMeResponse>(response);
        return data.user;
      },
    }),
};
