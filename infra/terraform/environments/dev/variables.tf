variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns Belu resources."
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token for Terraform. Do not commit this value."
  sensitive   = true
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID used for Worker routes."
}

variable "domain" {
  type        = string
  description = "Base domain for the dev environment."
}
