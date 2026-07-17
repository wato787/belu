import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useCreatePet } from "../useCreatePet";
import { useDeletePet } from "../useDeletePet";
import { Form } from "./Form/Form";
import { List } from "./List/List";
import type { Pet, SpacePetsViewMode } from "./types";

type SpacePetsProps = {
  spaceId: string;
};

export const SpacePets = ({ spaceId }: SpacePetsProps) => {
  const navigate = useNavigate();
  const { createPet, isPending: isCreatePending } = useCreatePet(spaceId);
  const { deletePet } = useDeletePet(spaceId);
  const [viewMode, setViewMode] = useState<SpacePetsViewMode>("list");

  const handleAddClick = () => {
    setViewMode("add");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const handleEditClick = (pet: Pet) => {
    void navigate({
      params: { petId: pet.id, spaceId },
      to: "/spaces/$spaceId/pets/$petId",
    });
  };

  const handleDeleteClick = (pet: Pet) => {
    const confirmed = window.confirm("ペットを削除してもよろしいですか？");

    if (!confirmed) {
      return;
    }

    deletePet(pet.id);
  };

  if (viewMode === "add") {
    return (
      <Form
        isPending={isCreatePending}
        mode="add"
        onBack={handleBackToList}
        onSubmit={(name) => {
          createPet(
            { name },
            {
              onSuccess: handleBackToList,
            },
          );
        }}
      />
    );
  }

  return (
    <List
      onAddClick={handleAddClick}
      onDeleteClick={handleDeleteClick}
      onEditClick={handleEditClick}
      spaceId={spaceId}
    />
  );
};
