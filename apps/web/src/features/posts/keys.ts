export const postsKeys = {
  all: ["posts"] as const,
  bySpace: (spaceId: string) => [...postsKeys.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...postsKeys.bySpace(spaceId), "list"] as const,
  detail: (spaceId: string, postId: string) =>
    [...postsKeys.bySpace(spaceId), "detail", postId] as const,
};
