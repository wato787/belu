import { useMutation } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "../../lib/authClient";

const loginRouteApi = getRouteApi("/login");

type LoginCredentials = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  const search = loginRouteApi.useSearch();

  const mutation = useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        throw new Error(error.message ?? "ログインに失敗しました。");
      }
    },
    onSuccess: async () => {
      await router.navigate({
        to: search.redirect ?? "/spaces",
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "ログインに失敗しました。");
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
  };
};
