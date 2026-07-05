# API Design

## Framework

- Hono
- Hono RPC

---

## API Style

- Hono RPCを前提にAPIを定義する。
- HTTPとしてはRESTfulなリソース設計を意識する。
- API側でAppTypeをexportし、将来的にクライアント側からhc<AppType>()で型を共有する。
- まずはAPI側の型安全なルーティングを優先し、Web側のRPCクライアント導入は後続で行う。

---

## Validation

- Zod
- @hono/zod-validator

リクエストボディ、パスパラメータ、クエリパラメータを受け取るRouteではバリデーションを行う。

---

## Initial Directory Structure

初期段階では分割しすぎず、src/index.tsにHonoアプリケーションとRoute定義を集約する。

```text
src/
├── index.ts
└── exceptions/
    ├── bad-request-exception.ts
    ├── unauthorized-exception.ts
    ├── forbidden-exception.ts
    ├── not-found-exception.ts
    ├── conflict-exception.ts
    ├── internal-server-exception.ts
    └── index.ts
```

---

## Future Directory Structure

Routeが増えてsrc/index.tsが読みづらくなったタイミングで、Feature単位の分割を検討する。

```text
src/
├── index.ts
├── exceptions/
├── routes/
│   ├── auth/
│   ├── spaces/
│   ├── pets/
│   ├── posts/
│   ├── invites/
│   └── health/
├── middleware/
├── lib/
├── db/
└── types/
```

app.tsは必須にしない。必要になった場合のみ、Honoアプリケーション構築をsrc/app.tsへ切り出す。

---

## Responsibilities

### index.ts

- Cloudflare Workersのエントリーポイント
- Honoアプリケーションの作成
- Middleware登録
- Route登録
- AppTypeのexport
- Hono appのdefault export

### exceptions/

- HTTPエラーを表す共通Exceptionを管理する。
- 各ExceptionはHonoのHTTPExceptionを継承する。
- RouteやUse CaseではHTTP statusに対応するExceptionをthrowする。
- index.tsはExceptionのbarrel exportのみを責務にする。

### routes/

- Routeが増えた場合のみ導入する。
- Feature単位でRouteを管理する。
- Featureごとのindex.tsはRoute集約のみを責務にする。
- 各ファイルは1ユースケースのみを実装する。

### middleware/

- 認証
- 認可
- 共通Middleware

### lib/

- 共通ユーティリティ
- Cloudflare関連
- Logger
- Helper

### db/

- Drizzle
- Schema
- Migration
- Database Client

### types/

- 共通型

---

## Routing

Hono RPCの型推論を活かすため、Routeはチェーンして定義する。

```ts
import { Hono } from "hono";

const app = new Hono().get("/health", (c) => c.json({ status: "ok" }));

export type AppType = typeof app;

export default app;
```

Routeが増えた後も、最終的にAppTypeがアプリケーション全体のRoute型を表すようにする。

---

## File Naming

Route分割後のファイル名はユースケースを表す。

- {action}-{resource}.ts の形式で命名する。
- 1ファイル1ユースケースとする。

例

- list-posts.ts
- get-post.ts
- create-post.ts
- update-post.ts
- delete-post.ts
- accept-invite.ts
- create-space.ts

---

## RPC

- Routeをチェーンして定義する。
- API側からAppTypeをexportする。
- Web側は後続でhc<AppType>()を利用する。
- RPCの型共有を壊さないため、Route定義の戻り値型が失われる抽象化は避ける。

---

## Request Validation

- zValidatorを利用する。
- バリデーション済みデータはc.req.valid()から取得する。

---

## Response

- JSONを返却する。
- HTTP Status Codeを適切に返却する。
- RPCクライアントから扱いやすいよう、レスポンス形状はRouteごとに一貫させる。

---

## Exceptions

初期段階ではHTTP statusに対応するExceptionを用意する。

```text
src/exceptions/
├── bad-request-exception.ts
├── unauthorized-exception.ts
├── forbidden-exception.ts
├── not-found-exception.ts
├── conflict-exception.ts
├── internal-server-exception.ts
└── index.ts
```

```ts
import { HTTPException } from "hono/http-exception";

export class NotFoundException extends HTTPException {
  constructor(message = "Not Found") {
    super(404, { message });
  }
}
```

- 400: BadRequestException
- 401: UnauthorizedException
- 403: ForbiddenException
- 404: NotFoundException
- 409: ConflictException
- 500: InternalServerException

---

## Logging

- 専用のloggerを利用する。
- Routeからconsole.logやconsole.errorを直接呼ばない。
- 初期実装では外部Loggerライブラリは利用しない。
- Worker上で扱いやすいJSON形式で標準出力へ出力する。
- すべてのログにtimestamp、level、messageを含める。
- request loggingではrequest_id、method、path、status、durationを記録する。
- request_idはUUIDv7を利用する。
- Password、Authorization Header、Cookie、Session Token、Invite Token、Signed URL、個人情報、Request Body全体はログへ出力しない。

---

## Error Handling

- app.use()でRequest IDを発行し、request loggingを行う。
- Request IDはx-request-idヘッダーがあれば引き継ぎ、なければUUIDv7で生成する。
- app.notFound()で未定義RouteをNotFoundException相当の404として扱う。
- app.onError()で共通エラーハンドリングを行う。
- HTTPExceptionはstatus codeとmessageをJSONとして返す。
- 予期しないErrorはInternalServerException相当の500として扱う。
- エラーレスポンスの基本形は{ message: string }に統一する。
- 初期段階では必要最低限に留め、ドメイン固有エラーが増えたタイミングで整理する。

---

## Middleware

- 共通Middlewareはapp.use()で登録する。
- 認証が必要なRouteのみ認証Middlewareを適用する。
- 初期段階では未使用のMiddlewareディレクトリを先に作らない。

---

## Design Principles

- Hono RPCの型推論を優先する。
- 初期段階ではsrc/index.tsに集約する。
- Routeが増えたらFeature単位で分割する。
- 不要な抽象化は行わない。
- 共通化は必要になるまで行わない（YAGNI）。
- Honoの設計思想を優先する。
