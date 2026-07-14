output "name" {
  description = "API Worker name."
  value       = cloudflare_workers_script.this.script_name
}

output "id" {
  description = "API Worker script ID."
  value       = cloudflare_workers_script.this.id
}
