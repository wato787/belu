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

Query keyとqueryOptionsは、UI feature単位ではなくAPI resource単位で定義する。

```text
apps/web/src/queries/{resource}.ts
```

各resourceではkey factoryとoptions factoryを同居させる。

```ts
export const meQueries = {
  all: ["me"] as const,
  current: () =>
    queryOptions({
      queryKey: meQueries.all,
      queryFn: async () => {
        const response = await apiClient.me.$get();
        return parseApiResponse(response);
      },
    }),
};
```

ComponentやRoute loaderではcustom hookを経由せず、`useQuery(meQueries.current())` や `queryClient.ensureQueryData(meQueries.current())` のようにoptionsを直接利用する。

Space配下のresourceでは `spaceId` をquery keyへ含め、Space単位でinvalidateできる階層にする。

```ts
export const postsQueries = {
  all: ["posts"] as const,
  bySpace: (spaceId: string) => [...postsQueries.all, "space", spaceId] as const,
  lists: (spaceId: string) => [...postsQueries.bySpace(spaceId), "list"] as const,
  list: (spaceId: string) =>
    queryOptions({
      queryKey: postsQueries.lists(spaceId),
      queryFn: async () => {
        const response = await apiClient.spaces[":spaceId"].posts.$get({
          param: { spaceId },
        });
        return parseApiResponse(response);
      },
    }),
};
```
