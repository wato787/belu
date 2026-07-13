import { Link } from "@tanstack/react-router";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "../../../components/Button/Button";
import { Field, FieldLabel } from "../../../components/Field/Field";
import { Textarea } from "../../../components/Textarea/Textarea";
import type { FormSubmitHandler } from "../../../types/form";
import styles from "./PostForm.module.css";

type PostFormPet = {
  id: string;
  name: string;
};

type PostFormProps = {
  actionLabel: string;
  body: string;
  errorMessage: string | null;
  isPending: boolean;
  onBack: () => void;
  onBodyChange: (body: string) => void;
  onSubmit: FormSubmitHandler;
  onTogglePet: (petId: string) => void;
  pendingContent: ReactNode;
  pets: PostFormPet[];
  photoSection: ReactNode;
  selectedPetIds: string[];
  spaceId: string;
  submitDisabled?: boolean | undefined;
  title: string;
};

export const PostForm = ({
  actionLabel,
  body,
  errorMessage,
  isPending,
  onBack,
  onBodyChange,
  onSubmit,
  onTogglePet,
  pendingContent,
  pets,
  photoSection,
  selectedPetIds,
  spaceId,
  submitDisabled = false,
  title,
}: PostFormProps) => (
  <main className={styles.main}>
    <div className={styles.shell}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1>{title}</h1>
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
            {pendingContent}
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            {photoSection}

            <Field className={styles.field}>
              <div className={styles.fieldHeader}>
                <FieldLabel>本文</FieldLabel>
                <span>任意</span>
              </div>
              <Textarea
                className={styles.textarea}
                onChange={(event) => onBodyChange(event.target.value)}
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
                  <Link className={styles.petLink} params={{ spaceId }} to="/spaces/$spaceId/pets">
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
                        onClick={() => onTogglePet(pet.id)}
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
              <Button className={styles.cancelButton} onClick={onBack}>
                キャンセル
              </Button>
              <Button className={styles.submitButton} disabled={submitDisabled} type="submit">
                {actionLabel}
              </Button>
            </footer>
          </form>
        )}
      </section>
    </div>
  </main>
);
