type SpacePetsProps = {
  spaceId: string;
};

export const SpacePets = ({ spaceId }: SpacePetsProps) => (
  <main>
    <h1>Pets</h1>
    <p>{spaceId}</p>
  </main>
);
