variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns Belu resources."
}

variable "web_base_url" {
  type        = string
  description = "Public base URL allowed to upload photos directly to R2."
}
