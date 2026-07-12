import { queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

import { apiClient, parseApiResponse } from "../../lib/apiClient";
import { petsKeys } from "./keys";

type ListPetsResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["pets"]["$get"],
  200
>;
type GetPetResponse = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["pets"][":petId"]["$get"],
  200
>;

export const petsQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: petsKeys.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets.$get({
          param: { spaceId },
        });
        const data = await parseApiResponse<ListPetsResponse>(response);
        return data.pets;
      },
    }),
  detail: (spaceId: string, petId: string) =>
    queryOptions({
      queryKey: petsKeys.detail(spaceId, petId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].pets[":petId"].$get({
          param: { petId, spaceId },
        });
        const data = await parseApiResponse<GetPetResponse>(response);
        return data.pet;
      },
    }),
};
