import { mutationOptions, type QueryClient } from "@tanstack/react-query";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { membersKeys } from "./keys";

export const membersMutations = {
  delete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ memberId, spaceId }: { memberId: string; spaceId: string }) => {
        const response = await apiClient.spaces[":spaceId"].members[":memberId"].$delete({
          param: { memberId, spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: membersKeys.list(variables.spaceId) });
      },
    }),
};
