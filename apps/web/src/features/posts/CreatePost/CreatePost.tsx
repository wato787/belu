import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import type { FormSubmitHandler } from "../../../types/form";
import { petsQueries } from "../../pets";
import { PostForm } from "../PostForm/PostForm";
import { useSubmitPost } from "../useSubmitPost";
import { PhotoPicker } from "./PhotoPicker/PhotoPicker";
import styles from "./CreatePost.module.css";
import { usePostPhotos } from "./usePostPhotos";

type CreatePostProps = {
  spaceId: string;
};

export const CreatePost = ({ spaceId }: CreatePostProps) => {
  const navigate = useNavigate();
  const { data: pets } = useSuspenseQuery(petsQueries.list(spaceId));
  const { isPending, submitPost, submitStep, uploadedPhotoCount } = useSubmitPost(spaceId);
  const { addPhotos, clearPhotoError, photoErrorMessage, photos, rejectPhotos, removePhoto } =
    usePostPhotos();
  const [body, setBody] = useState("");
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const errorMessage = formErrorMessage ?? photoErrorMessage;

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

    const trimmedBody = body.trim();
    clearPhotoError();

    if (photos.length === 0) {
      setFormErrorMessage("少なくとも1枚の写真をアップロードしてください。");
      return;
    }

    setFormErrorMessage(null);
    submitPost({
      body: trimmedBody,
      files: photos,
      petIds: selectedPetIds,
    });
  };

  return (
    <PostForm
      actionLabel="投稿する"
      body={body}
      errorMessage={errorMessage}
      isPending={isPending}
      onBack={handleBack}
      onBodyChange={setBody}
      onSubmit={handleSubmit}
      onTogglePet={togglePetSelection}
      pendingContent={
        <>
          <div>
            <p>
              {submitStep === "upload-url" && "投稿の準備をしています..."}
              {submitStep === "uploading" &&
                `写真をアップロードしています (${uploadedPhotoCount}/${photos.length}枚)`}
              {submitStep === "creating" && "投稿を保存しています..."}
            </p>
            <span>完了するまで、この画面を閉じずにお待ちください。</span>
          </div>
          {submitStep === "uploading" && (
            <div className={styles.progressTrack}>
              <div
                className={styles.progressValue}
                style={{ width: `${(uploadedPhotoCount / photos.length) * 100}%` }}
              />
            </div>
          )}
        </>
      }
      pets={pets}
      photoSection={
        <PhotoPicker
          onAdd={addPhotos}
          onReject={rejectPhotos}
          onRemove={removePhoto}
          photos={photos}
        />
      }
      selectedPetIds={selectedPetIds}
      spaceId={spaceId}
      submitDisabled={photos.length === 0}
      title="新規投稿"
    />
  );
};
