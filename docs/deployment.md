# デプロイ設計

## 対象範囲

dev 環境のデプロイは、以下の責務に分ける。

- Terraform は Cloudflare リソースと Worker デプロイを管理する。
- Wrangler D1 migrations は DB スキーマ変更を管理する。

インフラの状態管理と DB スキーマ履歴は別の責務として扱う。

## dev デプロイフロー

```text
build
terraform apply
wrangler d1 migrations apply --remote
```

通常の dev デプロイでは、以下のタスクを利用する。

```bash
mise run deploy-dev
```

実行順は以下。

1. API / web の成果物を build する。
2. Terraform で R2 / D1 / Worker script / binding を反映する。
3. remote D1 migration を適用する。

## Terraform

dev Terraform は `infra/terraform/environments/dev` に配置する。

ローカルで必要な値は、`terraform.tfvars.example` を `terraform.tfvars` にコピーして設定する。

```hcl
cloudflare_account_id = "..."
api_base_url          = "https://belu-api-dev.<workers-subdomain>.workers.dev"
web_base_url          = "https://belu-web-dev.<workers-subdomain>.workers.dev"
```

`CLOUDFLARE_API_TOKEN` は Cloudflare Terraform provider が環境変数から読み取る。`terraform.tfvars` には入れない。

custom domain / Worker route はドメイン決定後に対応する。MVP では `api_base_url` と `web_base_url` に workers.dev の URL を指定する。

## DB migration

local D1 migration:

```bash
mise run db-migrate-local-api
```

dev D1 migration:

```bash
mise run db-migrate-dev-api
```

remote migration は D1 database が存在していないと実行できない。そのため、初回は Terraform apply の後に migration を実行する。

## GitHub Actions 前提

CI でも local dev と同じ順序で実行する。

```text
bun install
mise run deploy-dev
```

GitHub Secret:

- `CLOUDFLARE_API_TOKEN`

GitHub Variables もしくは environment ごとの設定:

- `CLOUDFLARE_ACCOUNT_ID`
- `API_BASE_URL`
- `WEB_BASE_URL`

CI では、これらを `TF_VAR_cloudflare_account_id` / `TF_VAR_api_base_url` / `TF_VAR_web_base_url` として渡すか、一時的な `terraform.tfvars` を workflow 内で生成する。

`AUTH_SECRET` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` などの Worker secret は Terraform では管理しない。Cloudflare Secrets Store を導入する判断をするまでは、Terraform 外で管理する。
