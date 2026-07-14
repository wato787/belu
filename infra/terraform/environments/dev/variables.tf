variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns Belu resources."
}

variable "api_base_url" {
  type        = string
  description = "Public base URL for the API Worker."
}

variable "web_base_url" {
  type        = string
  description = "Public base URL for the web Worker."
}
