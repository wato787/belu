import { Button } from "../../../../components/Button/Button";
import { Field, FieldLabel } from "../../../../components/Field/Field";
import { Input } from "../../../../components/Input/Input";
import { useInputText } from "../../../../hooks/useInputText";
import type { FormSubmitHandler } from "../../../../types/form";
import { validateText } from "../../../../validations/validateText";
import { useCreateSpace } from "../useCreateSpace";
import styles from "./CreateForm.module.css";

type CreateFormProps = {
  onBack: () => void;
};

export const CreateForm = ({ onBack }: CreateFormProps) => {
  const { createSpace, isPending } = useCreateSpace();
  const name = useInputText({ validator: validateText });

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();

    if (name.validate()) {
      return;
    }

    createSpace({ name: name.value.trim() });
  };

  return (
    <main className={styles.createPage}>
      <div className={styles.formCard}>
        <header className={styles.createHeader}>
          <h1 className={styles.createTitle}>スペースを作成</h1>
          <p className={styles.createDescription}>
            新しくペットの思い出を記録・共有するスペースを作成します。
          </p>
        </header>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <Field error={name.error}>
            <FieldLabel>スペース名</FieldLabel>
            <Input
              autoComplete="organization"
              disabled={isPending}
              name="spaceName"
              onChange={name.onChange}
              placeholder="例: わが家のペットたち, 実家の猫たち"
              value={name.value}
            />
          </Field>

          <div className={styles.formActions}>
            <Button
              className={styles.secondaryButton}
              disabled={isPending}
              onClick={onBack}
              type="button"
            >
              キャンセル
            </Button>
            <Button isLoading={isPending} type="submit">
              スペースを作成
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
