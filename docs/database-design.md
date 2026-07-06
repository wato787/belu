# Database Design

## Goal

APIでCloudflare D1とDrizzle ORMを利用し、認証基盤とBeluドメインテーブルを明確に分離して管理する。

---

## Database

- Cloudflare D1
- Drizzle ORM
- Drizzle Kit

---

## Authentication Tables

認証・組織管理はBetter Authに委譲する。

採用するPlugin:

- Organization Plugin

Better Authが管理するテーブル:

```text
user
session
account
verification
organization
member
invitation
```

以下はBetter Authの責務とする。

- User
- Session
- Organization（BeluのSpace）
- Member
- Invitation
- Role

Better AuthのDrizzle schemaは `apps/api/src/db/schema/auth.ts` に配置する。
このファイルはBetter Auth CLIで生成し、手動編集しない。

---

## Belu Tables

Beluが管理するテーブル:

```text
pets
posts
photos
post_pets
reactions
```

BeluはPet、Post、Photo、Reactionなどのドメインモデルに集中する。
Space、Member、InvitationはBetter Auth Organization Pluginのテーブルを利用する。

PhotoはPost作成時にPostの一部として作成する。
アップロードURL発行時点ではDB recordを作成しない。
MVPでは未使用のR2 Object cleanupは行わない。

---

## Naming

### Table

- Belu管理テーブルは複数形を使用する。
- `snake_case` を使用する。
- Better Auth管理テーブルはBetter Authの生成名を正とする。

### Column

- `snake_case` を使用する。

---

## Primary Key

- Belu管理テーブルの主キーはUUIDv7を採用する。
- すべてのBelu管理テーブルで `id` を主キーとする。
- Better Auth管理テーブルのID生成はBetter Authに委譲する。

---

## Common Columns

すべてのBelu管理テーブルは以下のカラムを持つ。

```text
id
created_at
updated_at
```

---

## Foreign Key

- 外部キー制約を利用する。
- `ON DELETE CASCADE` を基本とする。
- Belu管理テーブルは必要に応じて `organization` / `member` を参照する。

---

## Timestamp

- UTCで保存する。
- 表示時にローカルタイムへ変換する。

---

## Soft Delete

採用しない。

必要になるまで実装しない（YAGNI）。

---

## Unique Constraint

必要な箇所のみ設定する。

初期実装では以下を設定する。

- `post_pets(post_id, pet_id)`
- `reactions(post_id, member_id, type)`

Photoの `object_key` はR2 Object Keyを保存する。
MVPでは `object_key` のunique constraintは必須としないが、同一Objectを複数Photoへ紐付けないようAPIで検証する。

---

## Schema Structure

```text
apps/api/src/
└── db/
    ├── client.ts
    ├── helpers/
    │   └── timestamp.ts
    └── schema/
        ├── auth.ts
        ├── pets.ts
        ├── posts.ts
        ├── photos.ts
        ├── reactions.ts
        └── index.ts
```

---

## Commands

Better Auth schemaを再生成する。

```bash
mise run auth-generate-schema-api
```

Drizzle migrationを生成する。

```bash
mise run db-generate-api
```

ローカルD1へmigrationを適用する。

```bash
mise run db-migrate-local-api
```

---

## Design Principles

- 認証・組織管理はBetter Authへ委譲する。
- Beluはドメインモデルの実装に集中する。
- シンプルなRDB設計を優先する。
- 不要な抽象化や最適化は行わない（YAGNI）。
