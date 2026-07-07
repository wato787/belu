export const petsKeys = {
  all: ["pets"] as const,
  bySpace: (spaceId: string) => [...petsKeys.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...petsKeys.bySpace(spaceId), "list"] as const,
  detail: (spaceId: string, petId: string) =>
    [...petsKeys.bySpace(spaceId), "detail", petId] as const,
};
