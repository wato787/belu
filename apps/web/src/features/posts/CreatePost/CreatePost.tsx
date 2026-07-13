import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../components/Button/Button";
import { Field, FieldLabel } from "../../../components/Field/Field";
import { Textarea } from "../../../components/Textarea/Textarea";
import { petsQueries } from "../../pets";
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

  const handleSubmit = () => {
    const trimmedBody = body.trim();
    clearPhotoError();

    if (photos.length === 0) {
      setFormErrorMessage("少なくとも1枚の写真をアップロードしてください。");
      return;
    }

    if (!trimmedBody) {
      setFormErrorMessage("本文を入力してください。");
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
    <main className={styles.main}>
      <div className={styles.shell}>
        <button
          className={styles.backButton}
          disabled={isPending}
          onClick={handleBack}
          type="button"
        >
          投稿一覧に戻る
        </button>

        <section className={styles.card}>
          <header className={styles.header}>
            <h1>新規投稿を作成</h1>
            <p>大切なペットの写真とメッセージを記録して、家族やメンバーに共有しましょう。</p>
          </header>

          {errorMessage && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              <div>
                <p>エラーが発生しました</p>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {isPending ? (
            <div className={styles.progressBox}>
              <Loader2 className={styles.spinner} size={32} />
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
            </div>
          ) : (
            <div className={styles.form}>
              <PhotoPicker
                onAdd={addPhotos}
                onReject={rejectPhotos}
                onRemove={removePhoto}
                photos={photos}
              />

              <Field className={styles.field}>
                <div className={styles.fieldHeader}>
                  <FieldLabel>本文</FieldLabel>
                  <span>必須</span>
                </div>
                <Textarea
                  className={styles.textarea}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="ココと一緒にドッグランに来ました！とても元気に走り回っています。"
                  value={body}
                />
              </Field>

              <section className={styles.petSection}>
                <div className={styles.fieldHeader}>
                  <h2>ペットタグ</h2>
                  <span>任意</span>
                </div>

                {pets.length === 0 ? (
                  <div className={styles.emptyPets}>
                    <div>
                      <p>ペットが登録されていません</p>
                      <span>ペット管理から登録すると、投稿にペットを紐づけて整理できます。</span>
                    </div>
                    <Link
                      className={styles.petLink}
                      params={{ spaceId }}
                      to="/spaces/$spaceId/pets"
                    >
                      ペットを登録する
                    </Link>
                  </div>
                ) : (
                  <div className={styles.petList}>
                    {pets.map((pet) => {
                      const isSelected = selectedPetIds.includes(pet.id);

                      return (
                        <button
                          className={styles.petButton}
                          data-selected={isSelected}
                          key={pet.id}
                          onClick={() => togglePetSelection(pet.id)}
                          type="button"
                        >
                          <span>{pet.name}</span>
                          {isSelected && <Check size={12} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <footer className={styles.actions}>
                <Button className={styles.cancelButton} onClick={handleBack}>
                  キャンセル
                </Button>
                <Button
                  className={styles.submitButton}
                  disabled={photos.length === 0 || !body.trim()}
                  onClick={handleSubmit}
                >
                  投稿する
                </Button>
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
