import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { petsQueries } from "../queries";
import { Form } from "../SpacePets/Form/Form";
import { useUpdatePet } from "../useUpdatePet";

type PetEditProps = {
  petId: string;
  spaceId: string;
};

export const PetEdit = ({ petId, spaceId }: PetEditProps) => {
  const navigate = useNavigate();
  const { data: pet } = useSuspenseQuery(petsQueries.detail(spaceId, petId));
  const { isPending, updatePet } = useUpdatePet(spaceId);

  const handleBack = () => {
    void navigate({
      params: { spaceId },
      to: "/spaces/$spaceId/pets",
    });
  };

  const handleSubmit = (name: string) => {
    updatePet(
      {
        input: { name },
        petId,
      },
      {
        onSuccess: handleBack,
      },
    );
  };

  return (
    <Form
      initialName={pet.name}
      isPending={isPending}
      mode="edit"
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
};
