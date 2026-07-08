type PetDetailProps = {
  petId: string;
  spaceId: string;
};

export const PetDetail = ({ petId, spaceId }: PetDetailProps) => (
  <main>
    <h1>Pet</h1>
    <p>
      {spaceId} / {petId}
    </p>
  </main>
);
