module "d1_database" {
  source = "../../modules/d1_database"

  account_id = var.cloudflare_account_id
  name       = local.d1_database_name
}

module "r2_bucket" {
  source = "../../modules/r2_bucket"

  account_id      = var.cloudflare_account_id
  name            = local.r2_bucket_name
  allowed_origins = [var.web_base_url]
}
