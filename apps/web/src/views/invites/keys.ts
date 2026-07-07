export const invitesKeys = {
  all: ["invites"] as const,
  bySpace: (spaceId: string) => [...invitesKeys.all, "space", spaceId] as const,
  list: (spaceId: string) => [...invitesKeys.bySpace(spaceId), "list"] as const,
  detail: (inviteId: string) => [...invitesKeys.all, "detail", inviteId] as const,
};
