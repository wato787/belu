type SpaceMember = {
  id: string;
  organizationId: string;
  role: string;
  createdAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null | undefined;
  };
};

export const formatSpaceMember = (member: SpaceMember) => ({
  id: member.id,
  spaceId: member.organizationId,
  userId: member.userId,
  role: member.role,
  createdAt: member.createdAt,
  user: member.user
    ? {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image ?? null,
      }
    : undefined,
});
