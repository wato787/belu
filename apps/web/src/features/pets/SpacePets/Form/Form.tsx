import { Button } from "../../../../components/Button/Button";
import { Field, FieldLabel } from "../../../../components/Field/Field";
import { Input } from "../../../../components/Input/Input";
import { useInputText } from "../../../../hooks/useInputText";
import type { FormSubmitHandler } from "../../../../types/form";
import { validateText } from "../../../../validations/validateText";
import styles from "./Form.module.css";

type FormProps = {
  initialName?: string;
  isPending: boolean;
  mode: "add" | "edit";
  onBack: () => void;
  onSubmit: (name: string) => void;
};

export const Form = ({ initialName = "", isPending, mode, onBack, onSubmit }: FormProps) => {
  const name = useInputText({ initialValue: initialName, validator: validateText });
  const isEdit = mode === "edit";
  const canSubmit = Boolean(name.value.trim() && !name.error);

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(name.value.trim());
  };

  return (
    <main className={styles.main}>
      <div className={styles.formShell}>
        <section className={styles.formCard}>
          <header>
            <h1>{isEdit ? "ペット情報を編集する" : "ペットを登録する"}</h1>
            <p>
              {isEdit
                ? "登録したペットの名前を編集・変更します。"
                : "新しいペットを登録しましょう。登録したペットは、写真や動画の投稿にタグ付けして管理することができます。"}
            </p>
          </header>

          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <Field error={name.error}>
              <FieldLabel>
                ペットの名前 <span className={styles.required}>*</span>
              </FieldLabel>
              <Input
                autoComplete="off"
                disabled={isPending}
                name="petName"
                onChange={name.onChange}
                placeholder="例: ぽち、ルル、ココ"
                value={name.value}
              />
              {!isEdit && (
                <p className={styles.fieldHint}>
                  いつでも後から名前を編集・変更することができます。
                </p>
              )}
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
              <Button disabled={!canSubmit} isLoading={isPending} type="submit">
                {isEdit ? "保存する" : "登録する"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};
