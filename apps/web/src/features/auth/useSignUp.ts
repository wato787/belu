import { useMutation } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "../../lib/authClient";

const signUpRouteApi = getRouteApi("/signup");
const signUpFailedMessage = "アカウントを作成できませんでした。入力内容を確認してください。";

type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
};

export const useSignUp = () => {
  const router = useRouter();
  const search = signUpRouteApi.useSearch();

  // react-doctor-disable-next-line react-doctor/query-mutation-missing-invalidation
  const mutation = useMutation({
    mutationFn: async ({ email, name, password }: SignUpCredentials) => {
      const { error } = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (error) {
        throw new Error(signUpFailedMessage);
      }
    },
    onSuccess: async () => {
      toast.success("アカウントを作成しました。");

      await router.navigate({
        to: search.redirect ?? "/spaces",
        replace: true,
      });
    },
    onError: () => {
      toast.error(signUpFailedMessage);
    },
  });

  return {
    isPending: mutation.isPending,
    signUp: mutation.mutate,
  };
};
