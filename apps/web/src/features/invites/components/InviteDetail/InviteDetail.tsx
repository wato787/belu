type InviteDetailProps = {
  inviteId: string;
};

export const InviteDetail = ({ inviteId }: InviteDetailProps) => (
  <main>
    <h1>Invite</h1>
    <p>{inviteId}</p>
  </main>
);
