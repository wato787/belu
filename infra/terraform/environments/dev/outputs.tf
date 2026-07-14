output "d1_database_name" {
  description = "D1 database name."
  value       = module.d1_database.name
}

output "d1_database_id" {
  description = "D1 database UUID used by Wrangler."
  value       = module.d1_database.uuid
}

output "r2_bucket_name" {
  description = "R2 bucket name."
  value       = module.r2_bucket.name
}
