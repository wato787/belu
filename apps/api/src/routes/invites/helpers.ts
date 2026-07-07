type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: string;
  inviterId: string;
  expiresAt: Date;
  createdAt?: Date;
  organizationName?: string;
  organizationSlug?: string;
  inviterEmail?: string;
};

export const formatInvite = (invite: Invitation) => ({
  id: invite.id,
  spaceId: invite.organizationId,
  email: invite.email,
  role: invite.role,
  status: invite.status,
  inviterId: invite.inviterId,
  expiresAt: invite.expiresAt,
  createdAt: invite.createdAt,
  spaceName: invite.organizationName,
  spaceSlug: invite.organizationSlug,
  inviterEmail: invite.inviterEmail,
});

export const formatInviteMember = (member: {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
}) => ({
  id: member.id,
  spaceId: member.organizationId,
  userId: member.userId,
  role: member.role,
  createdAt: member.createdAt,
});
