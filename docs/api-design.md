# API Design

## Framework

* Hono
* Hono RPC

---

## API Style

* RESTful API
* Hono RPCを利用してクライアントと型を共有する

---

## Validation

* Zod
* `@hono/zod-validator`

すべてのリクエストはバリデーションを行う。

---

## Directory Structure

```text
src/
├── index.ts
├── app.ts
│
├── routes/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   └── callback.ts
│   │
│   ├── spaces/
│   │   ├── index.ts
│   │   ├── list-spaces.ts
│   │   ├── get-space.ts
│   │   ├── create-space.ts
│   │   ├── update-space.ts
│   │   └── delete-space.ts
│   │
│   ├── pets/
│   │   ├── index.ts
│   │   ├── list-pets.ts
│   │   ├── get-pet.ts
│   │   ├── create-pet.ts
│   │   ├── update-pet.ts
│   │   └── delete-pet.ts
│   │
│   ├── posts/
│   │   ├── index.ts
│   │   ├── list-posts.ts
│   │   ├── get-post.ts
│   │   ├── create-post.ts
│   │   ├── update-post.ts
│   │   └── delete-post.ts
│   │
│   ├── invites/
│   │   ├── index.ts
│   │   ├── create-invite.ts
│   │   ├── accept-invite.ts
│   │   └── revoke-invite.ts
│   │
│   └── health/
│       └── index.ts
│
├── middleware/
├── lib/
├── db/
└── types/
```

---

## Responsibilities

### index.ts

* エントリーポイント

### app.ts

* Honoアプリケーションの構築
* Middleware登録
* Route登録

### routes/

* Feature単位でRouteを管理する
* Featureごとにディレクトリを分割する
* `index.ts`はFeature内のRouteを集約する責務のみを持つ
* 各ファイルは1ユースケースのみを実装する

### middleware/

* 認証
* 認可
* 共通Middleware

### lib/

* 共通ユーティリティ
* Cloudflare関連
* Logger
* Helper

### db/

* Drizzle
* Schema
* Migration
* Database Client

### types/

* 共通型

---

## Routing

* Feature単位でRouteを分割する。
* Featureごとに`index.ts`を持つ。
* `index.ts`はRouteを集約する責務のみを持つ。
* Routeは`app.route()`で登録する。

---

## File Naming

* ファイル名はユースケースを表す。
* `{action}-{resource}.ts` の形式で命名する。
* 1ファイル1ユースケースとする。

例

* `list-posts.ts`
* `get-post.ts`
* `create-post.ts`
* `update-post.ts`
* `delete-post.ts`
* `accept-invite.ts`
* `create-space.ts`

---

## RPC

* Routeをチェーンして定義する。
* `AppType`をexportする。
* クライアントは`hc<AppType>()`を利用する。

---

## Request Validation

* `zValidator`を利用する。
* バリデーション済みデータは`c.req.valid()`から取得する。

---

## Response

* JSONを返却する。
* HTTP Status Codeを適切に返却する。

---

## Error Handling

* `app.onError()`で共通処理を行う。

---

## Middleware

* 共通Middlewareは`app.use()`で登録する。
* 認証が必要なRouteのみ認証Middlewareを適用する。

---

## Design Principles

* Featureを中心に構成する。
* ファイルはユースケース単位で分割する。
* 不要な抽象化は行わない。
* 共通化は必要になるまで行わない（YAGNI）。
* Honoの設計思想を優先する。
