type SpaceInvitesProps = {
  spaceId: string;
};

export const SpaceInvites = ({ spaceId }: SpaceInvitesProps) => (
  <main>
    <h1>Invites</h1>
    <p>{spaceId}</p>
  </main>
);
