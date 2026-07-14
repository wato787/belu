# デプロイ設計

## 方針

dev 環境は責務をシンプルに分ける。

- Terraform は Cloudflare の器を作る。
- Wrangler は Worker deploy / Worker secrets / D1 migration を扱う。
- GitHub Actions はそれらを順番に実行する。

Terraform で Worker deploy や secret value は管理しない。

## Terraform の対象

Terraform で管理するものは以下に絞る。

- D1 database
- R2 bucket
- R2 CORS

dev Terraform は `infra/terraform/environments/dev` に配置する。

必要な値は以下。

```hcl
cloudflare_account_id = "..."
web_base_url          = "https://belu-web-dev.<workers-subdomain>.workers.dev"
```

`CLOUDFLARE_API_TOKEN` は Cloudflare Terraform provider が環境変数から読み取る。`terraform.tfvars` には入れない。

Terraform apply 後、Wrangler の `database_id` には `d1_database_id` output の値を設定する。

## Wrangler の対象

Wrangler で扱うものは以下。

- API Worker deploy
- Web Worker deploy
- Worker secrets
- D1 migration

Worker が実行時に使う secret は Worker Secrets として管理する。

- `AUTH_SECRET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

## dev 手順

インフラ更新:

```bash
mise run infra-plan-dev
mise run infra-apply-dev
```

DB migration:

```bash
mise run db-migrate-dev-api
```

Worker deploy は Wrangler 側で行う。GitHub Actions を追加するときに、build / secret put / deploy / migration の順にまとめる。
