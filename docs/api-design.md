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
├── config.ts
├── logger.ts
├── middleware/
│   └── auth.ts
├── lib/
│   └── better-auth/
│       ├── index.ts
│       └── config.ts
└── helpers/
    ├── create-route.ts
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
├── config.ts
├── logger.ts
├── helpers/
│   ├── create-route.ts
│   └── exceptions/
├── routes/
│   ├── index.ts
│   ├── auth/
│   ├── spaces/
│   ├── pets/
│   ├── posts/
│   ├── invites/
│   └── health/
├── middleware/
│   └── auth.ts
├── lib/
│   └── better-auth/
├── db/
└── types/
```

app.tsは必須にしない。必要になった場合のみ、Honoアプリケーション構築をsrc/app.tsへ切り出す。

---

## API Routes Structure

Space配下のリソースは、URL構造に合わせてroutes/spaces/配下に配置する。

```text
src/routes/
├── auth/
│   ├── index.ts
│   ├── login.ts
│   ├── logout.ts
│   └── callback.ts
│
├── spaces/
│   ├── index.ts
│   ├── list-spaces.ts
│   ├── get-space.ts
│   ├── create-space.ts
│   ├── update-space.ts
│   ├── delete-space.ts
│   │
│   ├── pets/
│   │   ├── index.ts
│   │   ├── list-pets.ts
│   │   ├── get-pet.ts
│   │   ├── create-pet.ts
│   │   ├── update-pet.ts
│   │   └── delete-pet.ts
│   │
│   └── posts/
│       ├── index.ts
│       ├── list-posts.ts
│       ├── get-post.ts
│       ├── create-post.ts
│       ├── update-post.ts
│       └── delete-post.ts
│
└── health/
    └── index.ts
```

```text
GET    /spaces
POST   /spaces
GET    /spaces/:spaceId
PATCH  /spaces/:spaceId
DELETE /spaces/:spaceId

GET    /spaces/:spaceId/pets
POST   /spaces/:spaceId/pets
GET    /spaces/:spaceId/pets/:petId
PATCH  /spaces/:spaceId/pets/:petId
DELETE /spaces/:spaceId/pets/:petId

GET    /spaces/:spaceId/posts
POST   /spaces/:spaceId/posts
POST   /spaces/:spaceId/posts/upload-url
GET    /spaces/:spaceId/posts/:postId
PATCH  /spaces/:spaceId/posts/:postId
DELETE /spaces/:spaceId/posts/:postId
```

- URL構造とroutes構造を一致させる。
- Space配下のリソースは必ずspaceIdを持つ。
- Space配下のAPIでは、対象ユーザーがそのSpaceのMemberであることを確認する。

---

## Photo Upload URL

Postに紐付ける写真は、ClientからR2へ直接アップロードする。

APIは写真データを受け取らず、署名付きUpload URLの発行のみを行う。

```text
POST /spaces/:spaceId/posts/upload-url
```

### Request

```json
{
  "files": [
    {
      "contentType": "image/jpeg",
      "fileSize": 1234567
    }
  ]
}
```

### Response

```json
{
  "uploads": [
    {
      "uploadId": "0198...",
      "objectKey": "spaces/{spaceId}/posts/uploads/0198....jpg",
      "uploadUrl": "https://...",
      "expiresAt": "2026-07-06T12:00:00.000Z"
    }
  ]
}
```

### Rules

- 認証済みUserのみ利用できる。
- 対象UserがSpace Memberであることを確認する。
- `files` は1〜20件とする。
- `contentType` は許可された画像形式のみ受け付ける。
- `fileSize` は上限以内のみ受け付ける。
- `objectKey` はAPI側で生成する。
- Clientから `objectKey` を指定させない。
- `uploadId` はUUIDv7を利用する。
- 署名付きURLの有効期限は短くする。
- APIは写真データを中継しない。
- MVPでは未使用Objectのcleanupは後回しにする。

Allowed Content Types:

```text
image/jpeg
image/png
image/webp
image/heic
```

Object Key:

```text
spaces/{spaceId}/posts/uploads/{uploadId}.{ext}
```

### R2 Credentials

R2 Bucket BindingはR2 Objectの確認・削除などWorker内のObject操作に利用する。

署名付きURL生成にはR2のS3互換Credentialを利用する。
これはCloudflare REST API Tokenではなく、対象Bucketへの最小権限を持つR2用Credentialとして管理する。

Worker Runtimeに必要な設定:

```text
PHOTOS_BUCKET
R2_ACCOUNT_ID
R2_BUCKET_NAME
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

Cloudflare Account IDやR2 S3 Credentialは署名付きURL生成にのみ利用し、Cloudflare REST APIはWorker Runtimeから呼び出さない。

### Secret Management

R2 Bucket、CORS、LifecycleはTerraformで管理する。

R2 S3 Credentialの生値はTerraform stateに入れない。
Terraform Providerのtoken resourceでCredentialを作成することは可能だが、token valueがstateに残るため採用しない。

MVPではR2 S3 CredentialをCloudflareで発行し、Worker secretとして登録する。
環境が増えて手動登録が負担になった場合は、CI/CDまたはSecret ManagerからWorker secretへ同期する。

Worker Runtimeでは、Cloudflare REST API Tokenを保持しない。

---

## Create Post with Photos

`POST /spaces/:spaceId/posts` では、アップロード済みの写真情報を受け取る。
PhotoはPostの一部として作成し、独立したPhoto APIは作らない。

```json
{
  "body": "今日はドッグラン",
  "petIds": ["pet1", "pet2"],
  "photos": [
    {
      "uploadId": "0198...",
      "objectKey": "spaces/{spaceId}/posts/uploads/0198....jpg",
      "sortOrder": 0
    }
  ]
}
```

Rules:

- `photos` は任意とする。
- `photos` を指定する場合は1〜20件とする。
- `objectKey` は `spaces/{spaceId}/posts/uploads/{uploadId}.{ext}` 形式のみ受け付ける。
- `uploadId` と `objectKey` のUUIDv7部分が一致することを確認する。
- `sortOrder` は0以上の整数とする。
- Post作成前に `PHOTOS_BUCKET.head(objectKey)` でObject存在確認を行う。
- Objectが存在しない場合は400を返す。
- Photo recordはPost作成と同じDB処理の中で作成する。

---

## Responsibilities

### index.ts

- Cloudflare Workersのエントリーポイント
- Honoアプリケーションの作成
- Middleware登録
- Route登録
- AppTypeのexport
- Hono appのdefault export

### config.ts

- アプリケーション設定を管理する。
- Cloudflare Workers Bindingsの型を管理する。
- 環境変数へのアクセスを集約する。
- Routeからc.envやBindingsを直接参照しないための入口にする。

### logger.ts

- JSON形式のログ出力を管理する。
- Routeからconsole.logやconsole.errorを直接呼ばないための入口にする。

### helpers/

- 汎用Helperを管理する。
- Feature Routeではhelpers/create-route.ts経由でHono routeを作成する。
- HTTPエラーを表す共通Exceptionはhelpers/exceptionsに配置する。
- 各ExceptionはHonoのHTTPExceptionを継承する。
- RouteやUse CaseではHTTP statusに対応するExceptionをthrowする。
- helpers/exceptions/index.tsはExceptionのbarrel exportのみを責務にする。

### routes/

- Routeが増えた場合のみ導入する。
- src/routes/index.tsは全Feature Routeの集約のみを責務にする。
- Feature単位でRouteを管理する。
- Featureごとのindex.tsはFeature内のRoute集約のみを責務にする。
- 各ファイルは1ユースケースのみを実装する。

### middleware/

- Hono Middlewareを管理する。
- 認証状態の取得はmiddleware/auth.tsへ集約する。
- 認可Middlewareが増えた場合もこのディレクトリに追加する。
- Space配下の認可はmiddleware/space.tsへ集約する。
- Space配下のAPIではrequireSpaceMemberまたはrequireSpaceOwnerを利用する。

### lib/

- 外部ライブラリの薄い接続口を管理する。
- Better Authのruntime factoryはlib/better-auth/index.tsに配置する。
- Better Auth CLI用のschema生成設定はlib/better-auth/config.tsに配置する。
- 汎用Helperは責務が明確になった時点で追加する。

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

## Configuration

初期段階では設定をsrc/config.tsに集約する。

```text
src/
└── config.ts
```

- 設定が単一ファイルである間はsrc/直下に配置する。
- 複数ファイルへ分割する必要が生じた場合のみconfig/ディレクトリへ移行する。
- Cloudflare Workers Bindingsの型はAppBindingsで管理する。
- HonoにはAppHonoEnvを渡し、c.envの型を明示する。
- Routeで設定値を利用する場合はgetConfig(c.env)を経由する。
- Database、Object Storage、Authentication、Application、External Servicesの設定は必要になった時点で追加する。
- Cloudflare Workersの実装詳細をアプリケーション全体へ漏らさない。

---

## Exceptions

初期段階ではHTTP statusに対応するExceptionを用意する。

```text
src/helpers/exceptions/
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
