type SpaceMembersProps = {
  spaceId: string;
};

export const SpaceMembers = ({ spaceId }: SpaceMembersProps) => (
  <main>
    <h1>Members</h1>
    <p>{spaceId}</p>
  </main>
);
