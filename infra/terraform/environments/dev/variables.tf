variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns Belu resources."
}

variable "web_base_url" {
  type        = string
  description = "Public base URL allowed to upload photos directly to R2."

  validation {
    condition     = can(regex("^https?://[^/]+$", var.web_base_url))
    error_message = "web_base_url must be an origin only, such as https://belu-web-dev.example.workers.dev. Do not include a trailing slash or path."
  }
}
