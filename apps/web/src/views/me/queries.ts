import { queryOptions } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { meKeys } from "./keys";

export const meQueries = {
  current: () =>
    queryOptions({
      queryKey: meKeys.all,
      queryFn: async () => {
        const response = await apiClient.me.$get();
        return parseApiResponse(response);
      },
    }),
};
