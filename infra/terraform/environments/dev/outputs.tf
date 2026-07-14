output "api_worker_name" {
  description = "API Worker name."
  value       = module.api_worker.name
}

output "web_worker_name" {
  description = "Web Worker name."
  value       = module.web_worker.name
}

output "d1_database_name" {
  description = "D1 database name."
  value       = module.d1_database.name
}

output "r2_bucket_name" {
  description = "R2 bucket name."
  value       = module.r2_bucket.name
}
