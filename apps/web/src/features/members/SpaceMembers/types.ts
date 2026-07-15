export type SpaceMember = {
  id: string;
  role: string;
  user:
    | {
        email: string;
        name: string;
      }
    | undefined;
};

export type SpaceInvite = {
  id: string;
  email: string;
  expiresAt: Date | string;
  status: string;
};
