variable "account_id" {
  type        = string
  description = "Cloudflare account ID."
}

variable "allowed_origins" {
  type        = list(string)
  description = "Origins allowed to upload directly to R2."
}

variable "name" {
  type        = string
  description = "R2 bucket name."
}
