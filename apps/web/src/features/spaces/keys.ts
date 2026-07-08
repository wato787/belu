export const spacesKeys = {
  all: ["spaces"] as const,
  lists: () => [...spacesKeys.all, "list"] as const,
  detail: (spaceId: string) => [...spacesKeys.all, "detail", spaceId] as const,
};
