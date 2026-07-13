import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import type { FormSubmitHandler } from "../../../types/form";
import { petsQueries } from "../../pets";
import { PostForm } from "../PostForm/PostForm";
import { postsQueries } from "../queries";
import { useSubmitPostUpdate } from "../useSubmitPostUpdate";
import { ExistingPhotos } from "./ExistingPhotos/ExistingPhotos";

type EditPostProps = {
  postId: string;
  spaceId: string;
};

export const EditPost = ({ postId, spaceId }: EditPostProps) => {
  const navigate = useNavigate();
  const { data: pets } = useSuspenseQuery(petsQueries.list(spaceId));
  const { data: post } = useSuspenseQuery(postsQueries.detail(spaceId, postId));
  const { isPending, submitPostUpdate } = useSubmitPostUpdate(spaceId, postId);
  const [body, setBody] = useState(post.body);
  const [selectedPetIds, setSelectedPetIds] = useState(post.pets.map((pet) => pet.id));

  const handleBack = () => {
    navigate({ params: { spaceId }, to: "/spaces/$spaceId" });
  };

  const togglePetSelection = (petId: string) => {
    setSelectedPetIds((currentIds) =>
      currentIds.includes(petId)
        ? currentIds.filter((currentId) => currentId !== petId)
        : [...currentIds, petId],
    );
  };

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();

    submitPostUpdate({
      body: body.trim(),
      petIds: selectedPetIds,
    });
  };

  return (
    <PostForm
      actionLabel="変更を保存"
      body={body}
      errorMessage={null}
      isPending={isPending}
      onBack={handleBack}
      onBodyChange={setBody}
      onSubmit={handleSubmit}
      onTogglePet={togglePetSelection}
      pendingContent={
        <div>
          <p>投稿を保存しています...</p>
          <span>完了するまで、この画面を閉じずにお待ちください。</span>
        </div>
      }
      pets={pets}
      photoSection={<ExistingPhotos photos={post.photos} />}
      selectedPetIds={selectedPetIds}
      spaceId={spaceId}
      title="投稿を編集"
    />
  );
};
