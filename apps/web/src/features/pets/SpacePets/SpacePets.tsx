import { useState } from "react";

import { useCreatePet } from "../useCreatePet";
import { useDeletePet } from "../useDeletePet";
import { useUpdatePet } from "../useUpdatePet";
import { Form } from "./Form/Form";
import { List } from "./List/List";
import type { Pet, SpacePetsViewMode } from "./types";

type SpacePetsProps = {
  spaceId: string;
};

export const SpacePets = ({ spaceId }: SpacePetsProps) => {
  const { createPet, isPending: isCreatePending } = useCreatePet(spaceId);
  const { isPending: isUpdatePending, updatePet } = useUpdatePet(spaceId);
  const { deletePet } = useDeletePet(spaceId);
  const [viewMode, setViewMode] = useState<SpacePetsViewMode>("list");
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleAddClick = () => {
    setEditingPet(null);
    setViewMode("add");
  };

  const handleBackToList = () => {
    setEditingPet(null);
    setViewMode("list");
  };

  const handleEditClick = (pet: Pet) => {
    setEditingPet(pet);
    setViewMode("edit");
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

  if (viewMode === "edit" && editingPet) {
    return (
      <Form
        initialName={editingPet.name}
        isPending={isUpdatePending}
        mode="edit"
        onBack={handleBackToList}
        onSubmit={(name) => {
          updatePet(
            {
              input: { name },
              petId: editingPet.id,
            },
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
