type InvitesProps = {
  spaceId: string;
};

export const Invites = ({ spaceId }: InvitesProps) => (
  <main>
    <h1>Invites</h1>
    <p>{spaceId}</p>
  </main>
);
