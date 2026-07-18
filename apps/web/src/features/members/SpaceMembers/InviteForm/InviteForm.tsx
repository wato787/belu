import { Mail, UserPlus } from "lucide-react";

import { Button } from "../../../../components/Button/Button";
import { Field, FieldLabel } from "../../../../components/Field/Field";
import { Input } from "../../../../components/Input/Input";
import { useInputText } from "../../../../hooks/useInputText";
import type { FormSubmitHandler } from "../../../../types/form";
import { validateEmail } from "../../../../validations/validateEmail";
import { useCreateInvite } from "../../../invites";
import styles from "./InviteForm.module.css";

type InviteFormProps = {
  spaceId: string;
};

export const InviteForm = ({ spaceId }: InviteFormProps) => {
  const { createInvite, isPending } = useCreateInvite(spaceId);
  const email = useInputText({ validator: validateEmail });
  const canSubmit = Boolean(email.value.trim() && !email.error);

  const handleSubmit: FormSubmitHandler = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    createInvite({ email: email.value.trim().toLowerCase() });
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>
        <UserPlus size={16} />
        <span>メンバーを新しく招待する</span>
      </h2>

      <p className={styles.description}>
        メールアドレスを入力して招待を作成します。メールは自動送信されないため、作成後に発行される招待リンクを共有してください。
      </p>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <Field className={styles.field} error={email.error}>
          <FieldLabel>メールアドレス</FieldLabel>
          <Input
            autoComplete="email"
            disabled={isPending}
            leftIcon={<Mail size={16} />}
            name="inviteEmail"
            onChange={email.onChange}
            placeholder="name@example.com"
            type="email"
            value={email.value}
          />
        </Field>
        <Button
          className={styles.submitButton}
          disabled={!canSubmit}
          isLoading={isPending}
          type="submit"
        >
          招待リンクを作成
        </Button>
      </form>
    </section>
  );
};
