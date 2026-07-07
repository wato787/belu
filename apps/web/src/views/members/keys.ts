export const membersKeys = {
  all: ["members"] as const,
  bySpace: (spaceId: string) => [...membersKeys.all, "space", spaceId] as const,
  list: (spaceId: string) => [...membersKeys.bySpace(spaceId), "list"] as const,
};
