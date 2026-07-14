locals {
  app_name    = "belu"
  environment = "dev"

  d1_database_name = "${local.app_name}-${local.environment}"
  r2_bucket_name   = "${local.app_name}-photos-${local.environment}"
}
