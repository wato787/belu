module "d1_database" {
  source = "../../modules/d1_database"

  account_id = var.cloudflare_account_id
  name       = local.d1_database_name
}

module "r2_bucket" {
  source = "../../modules/r2_bucket"

  account_id      = var.cloudflare_account_id
  name            = local.r2_bucket_name
  allowed_origins = ["https://${local.web_hostname}"]
}

module "api_worker" {
  source = "../../modules/api_worker"

  account_id          = var.cloudflare_account_id
  name                = local.api_worker_name
  script_path         = local.api_worker_script_path
  compatibility_date  = "2026-07-05"
  compatibility_flags = ["nodejs_compat"]

  app_env                = "development"
  auth_base_url          = "https://${local.api_hostname}"
  auth_trusted_origins   = "https://${local.web_hostname}"
  photos_public_base_url = null
  r2_bucket_name         = module.r2_bucket.name

  d1_database_id = module.d1_database.id
  d1_binding     = "DB"
  r2_binding     = "PHOTOS_BUCKET"
}

module "web_worker" {
  source = "../../modules/web_worker"

  account_id  = var.cloudflare_account_id
  name        = local.web_worker_name
  assets_path = local.web_assets_path
}
