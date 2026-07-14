output "name" {
  description = "Web Worker name."
  value       = cloudflare_workers_script.this.script_name
}

output "id" {
  description = "Web Worker script ID."
  value       = cloudflare_workers_script.this.id
}
