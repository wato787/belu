import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import type { FormSubmitHandler } from "../../../types/form";
import { petsQueries } from "../../pets";
import { maxPostPhotoCount } from "../CreatePost/constants";
import { usePostPhotos } from "../CreatePost/usePostPhotos";
import { PostForm } from "../PostForm/PostForm";
import { postsQueries } from "../queries";
import { useSubmitPostUpdate } from "../useSubmitPostUpdate";
import styles from "../CreatePost/CreatePost.module.css";
import { EditPhotos, type ExistingEditablePhoto } from "./EditPhotos/EditPhotos";

type EditPostProps = {
  postId: string;
  spaceId: string;
};

export const EditPost = ({ postId, spaceId }: EditPostProps) => {
  const navigate = useNavigate();
  const { data: pets } = useSuspenseQuery(petsQueries.list(spaceId));
  const { data: post } = useSuspenseQuery(postsQueries.detail(spaceId, postId));
  const { isPending, submitPostUpdate, submitStep, uploadedPhotoCount } = useSubmitPostUpdate(
    spaceId,
    postId,
  );
  const [body, setBody] = useState(post.body);
  const initialPetIds = post.pets.map((pet) => pet.id);
  const [selectedPetIds, setSelectedPetIds] = useState(initialPetIds);
  const initialPhotos = sortPhotosByOrder(post.photos);
  const initialPhotoObjectKeys = initialPhotos.map((photo) => photo.objectKey);
  const [existingPhotos, setExistingPhotos] = useState<ExistingEditablePhoto[]>(initialPhotos);
  const { addPhotos, clearPhotoError, photoErrorMessage, photos, rejectPhotos, removePhoto } =
    usePostPhotos({ maxPhotoCount: maxPostPhotoCount - existingPhotos.length });
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const trimmedBody = body.trim();
  const hasBodyChanged = trimmedBody !== post.body;
  const hasPetSelectionChanged = !areSameStringSets(selectedPetIds, initialPetIds);
  const hasPhotoChanged =
    photos.length > 0 ||
    !areSameStringArrays(
      existingPhotos.map((photo) => photo.objectKey),
      initialPhotoObjectKeys,
    );
  const hasChanges = hasBodyChanged || hasPetSelectionChanged || hasPhotoChanged;
  const photoCount = existingPhotos.length + photos.length;
  const errorMessage = formErrorMessage ?? photoErrorMessage;

  const handleBack = () => {
    void navigate({ params: { spaceId }, to: "/spaces/$spaceId" });
  };

  const togglePetSelection = (petId: string) => {
    setSelectedPetIds((currentIds) =>
      currentIds.includes(petId)
        ? currentIds.filter((currentId) => currentId !== petId)
        : [...currentIds, petId],
    );
  };

  const removeExistingPhoto = (id: string) => {
    setExistingPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== id));
    setFormErrorMessage(null);
  };

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();
    clearPhotoError();

    if (!hasChanges) {
      return;
    }

    if (photoCount === 0) {
      setFormErrorMessage("少なくとも1枚の写真を残してください。");
      return;
    }

    setFormErrorMessage(null);
    submitPostUpdate({
      body: trimmedBody,
      files: photos,
      petIds: selectedPetIds,
      photos: existingPhotos.map((photo) => ({
        objectKey: photo.objectKey,
        uploadId: photo.uploadId,
      })),
    });
  };

  return (
    <PostForm
      actionLabel="変更を保存"
      body={body}
      description="本文、ペットタグ、写真を編集できます。"
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
        <EditPhotos
          existingPhotos={existingPhotos}
          newPhotos={photos}
          onAdd={addPhotos}
          onReject={rejectPhotos}
          onRemoveExisting={removeExistingPhoto}
          onRemoveNew={removePhoto}
        />
      }
      selectedPetIds={selectedPetIds}
      spaceId={spaceId}
      submitDisabled={!hasChanges || photoCount === 0}
      title="投稿を編集"
    />
  );
};

const areSameStringSets = (firstValues: string[], secondValues: string[]) => {
  if (firstValues.length !== secondValues.length) {
    return false;
  }

  const secondValueSet = new Set(secondValues);

  return firstValues.every((value) => secondValueSet.has(value));
};

const areSameStringArrays = (firstValues: string[], secondValues: string[]) =>
  firstValues.length === secondValues.length &&
  firstValues.every((value, index) => value === secondValues[index]);

const sortPhotosByOrder = <Photo extends { sortOrder: number }>(photos: Photo[]) =>
  photos.toSorted((firstPhoto, secondPhoto) => firstPhoto.sortOrder - secondPhoto.sortOrder);
