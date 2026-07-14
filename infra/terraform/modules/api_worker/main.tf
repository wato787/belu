locals {
  optional_plain_text_bindings = var.photos_public_base_url == null ? [] : [
    {
      name = "PHOTOS_PUBLIC_BASE_URL"
      text = var.photos_public_base_url
      type = "plain_text"
    },
  ]

  plain_text_bindings = concat(
    [
      {
        name = "APP_ENV"
        text = var.app_env
        type = "plain_text"
      },
      {
        name = "AUTH_BASE_URL"
        text = var.auth_base_url
        type = "plain_text"
      },
      {
        name = "AUTH_TRUSTED_ORIGINS"
        text = var.auth_trusted_origins
        type = "plain_text"
      },
      {
        name = "R2_BUCKET_NAME"
        text = var.r2_bucket_name
        type = "plain_text"
      },
    ],
    local.optional_plain_text_bindings,
  )
}

resource "cloudflare_workers_script" "this" {
  account_id          = var.account_id
  script_name         = var.name
  content_file        = var.script_path
  content_type        = "application/javascript+module"
  main_module         = "worker.js"
  compatibility_date  = var.compatibility_date
  compatibility_flags = var.compatibility_flags

  bindings = concat(
    [
      {
        name        = var.d1_binding
        type        = "d1"
        database_id = var.d1_database_id
      },
      {
        name        = var.r2_binding
        type        = "r2_bucket"
        bucket_name = var.r2_bucket_name
      },
    ],
    local.plain_text_bindings,
  )

  observability = {
    enabled = true
    logs = {
      enabled         = true
      invocation_logs = true
    }
  }
}

# Secrets intentionally not modeled in Terraform:
# - AUTH_SECRET
# - R2_ACCESS_KEY_ID
# - R2_SECRET_ACCESS_KEY
