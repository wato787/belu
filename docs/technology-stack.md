# 技術スタック

## Frontend

- React
- TanStack Router
- TanStack Query

## Backend

- Hono
- Hono RPC

## Runtime

- Cloudflare Workers

## Database

- Cloudflare D1

## ORM

- Drizzle ORM

## Object Storage

- Cloudflare R2

## Authentication

- Better Auth

## Package Manager

- Bun

## Tool Manager

- mise

## Task Runner

- mise

## Linter

- oxlint

## Formatter

- oxfmt

## Type Checker

- tsgo

## Monorepo

- Bun Workspaces

## Infrastructure as Code

- Terraform

## Worker Development

- Wrangler

## 方針

- ランタイム・CLI・タスクは `mise` で統一する。
- アプリケーションコードは Bun Workspaces で管理する。
- インフラリソースは Terraform で管理する。
- Cloudflare Workers のローカル開発およびデプロイには Wrangler を利用する。
- 型安全性を重視し、API は Hono RPC を採用する。
- MVPではシンプルさを優先し、不要な抽象化やツールは導入しない（YAGNI）。

## Infrastructure Boundary

Terraformで管理するもの:

- Cloudflare D1
- Cloudflare R2 Bucket
- R2 CORS
- R2 Lifecycle
- その他のCloudflareインフラリソース

Terraformで管理しないもの:

- R2 S3 Credentialの生値
- Worker secretの値

R2 S3 CredentialはWorker Runtimeで署名付きUpload URLと写真表示用の短命な署名付きGET URLを生成するために利用する。
MVPではCloudflareで発行し、WranglerまたはCloudflare DashboardからWorker secretとして登録する。
環境が増えて手動登録が負担になった場合は、CI/CDまたはSecret ManagerからWorker secretへ同期する。

SecretではないWorker設定は `wrangler.toml` の `[vars]` に置く。
Secretはローカル開発では `.dev.vars`、デプロイ環境ではWorker secretに置く。

Terraform Providerのtoken resourceでR2用Credentialを作成することは可能だが、token valueがTerraform stateに残るため採用しない。
