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

variable "storage_class" {
  type        = string
  description = "Default R2 storage class for new objects."
  default     = "Standard"
}
