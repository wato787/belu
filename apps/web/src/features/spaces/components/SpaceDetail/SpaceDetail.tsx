type SpaceDetailProps = {
  spaceId: string;
};

export const SpaceDetail = ({ spaceId }: SpaceDetailProps) => (
  <main>
    <h1>Space</h1>
    <p>{spaceId}</p>
  </main>
);
