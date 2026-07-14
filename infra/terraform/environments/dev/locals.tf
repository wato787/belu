locals {
  app_name    = "belu"
  environment = "dev"

  api_worker_name = "${local.app_name}-api-${local.environment}"
  web_worker_name = "${local.app_name}-web-${local.environment}"

  d1_database_name = "${local.app_name}-${local.environment}"
  r2_bucket_name   = "${local.app_name}-photos-${local.environment}"

  api_hostname = "api.${var.domain}"
  web_hostname = var.domain

  api_worker_script_path = "${path.root}/../../../../apps/api/dist/worker.js"
  web_assets_path        = "${path.root}/../../../../apps/web/dist"
}
