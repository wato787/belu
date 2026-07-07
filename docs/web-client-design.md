# Web Client Design

## API Client

WebからAPIを呼び出す場合は、Hono RPC clientを利用する。

```text
apps/web/src/lib/apiClient.ts
```

Clientは `hc<AppType>()` で作成し、APIの `AppType` を型として参照する。

Local devではVite proxyにより `/api/*` をAPI Workerへ転送するため、RPC clientのbase URLは `/api` とする。

Cookie sessionを利用するため、client fetchでは `credentials: "include"` を指定する。

API呼び出しは `apiClient` と `parseApiResponse` を利用し、HTTP 4xx系の `ApiRequestError` はQuery retry対象外とする。

Better Auth clientはログイン判定や認証操作に利用する。

```text
apps/web/src/lib/authClient.ts
```

ログイン判定はキャッシュしない。Route guardではTanStack Queryに乗せず、`authClient.getSession()` を直接呼ぶ。共通化は複数Routeで重複したタイミングで検討する。

---

## Router And Query

WebはTanStack RouterとTanStack Queryを組み合わせる。

```text
apps/web/src/lib/queryClient.ts
```

Routerは `main.tsx` で `createRouter({ routeTree, context })` により作成する。

Routerは `queryClient` をcontextとして受け取り、Route loaderから `context.queryClient.ensureQueryData(...)` を利用できるようにする。

QueryClientは `apps/web/src/lib/queryClient.ts` で作成し、`QueryClientProvider` でアプリ全体へ提供する。

Queryの再利用単位は `queryOptions` helperで定義する。

Query keyとqueryOptionsは、Route単位ではなくView domain単位で定義する。

```text
apps/web/src/views/{domain}/keys.ts
apps/web/src/views/{domain}/queries.ts
```

`views/` はRouteを定義しない。URLを持つものは `routes/` に置き、`views/` にはRouteから呼ばれる画面単位の部品とserver-state定義を置く。

Key factoryは `keys.ts` に置き、queryOptions factoryは `queries.ts` に置く。
mutationOptions factoryは `mutations.ts` に置く。

```ts
export const meKeys = {
  all: ["me"] as const,
};
```

```ts
export const meQueries = {
  current: () =>
    queryOptions({
      queryKey: meKeys.all,
      queryFn: async () => {
        const response = await apiClient.me.$get();
        return parseApiResponse(response);
      },
    }),
};
```

ComponentやRoute loaderではcustom hookを経由せず、`useQuery(meQueries.current())` や `queryClient.ensureQueryData(meQueries.current())` のようにoptionsを直接利用する。

Mutationのinvalidateでは `keys.ts` のkey factoryを直接参照する。

```text
apps/web/src/views/{domain}/mutations.ts
```

Mutationはcustom hookにせず、`mutationOptions` helperで定義する。

```ts
export const postsMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async ({ input, spaceId }) => {
        const response = await apiClient.spaces[":spaceId"].posts.$post({
          json: input,
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({
          queryKey: postsKeys.lists(variables.spaceId),
        });
      },
    }),
};
```

Space配下のdomainでは `spaceId` をquery keyへ含め、Space単位でinvalidateできる階層にする。

```ts
export const postsKeys = {
  all: ["posts"] as const,
  bySpace: (spaceId: string) => [...postsKeys.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...postsKeys.bySpace(spaceId), "list"] as const,
  detail: (spaceId: string, postId: string) =>
    [...postsKeys.bySpace(spaceId), "detail", postId] as const,
};
```

```ts
export const postsQueries = {
  list: (spaceId: string) =>
    queryOptions({
      queryKey: postsKeys.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
```
