variable "account_id" {
  type        = string
  description = "Cloudflare account ID."
}

variable "app_env" {
  type        = string
  description = "Application environment value exposed to the Worker."
}

variable "auth_base_url" {
  type        = string
  description = "Better Auth base URL."
}

variable "auth_trusted_origins" {
  type        = string
  description = "Comma-separated trusted origins for Better Auth."
}

variable "compatibility_date" {
  type        = string
  description = "Cloudflare Workers compatibility date."
}

variable "compatibility_flags" {
  type        = list(string)
  description = "Cloudflare Workers compatibility flags."
  default     = []
}

variable "d1_binding" {
  type        = string
  description = "D1 binding name exposed to the Worker."
}

variable "d1_database_id" {
  type        = string
  description = "D1 database ID bound to the Worker."
}

variable "name" {
  type        = string
  description = "API Worker name."
}

variable "photos_public_base_url" {
  type        = string
  description = "Public base URL for photo reads. Null keeps photo URLs absent."
  default     = null
}

variable "r2_binding" {
  type        = string
  description = "R2 binding name exposed to the Worker."
}

variable "r2_bucket_name" {
  type        = string
  description = "R2 bucket name used by binding and signed upload URL generation."
}

variable "script_path" {
  type        = string
  description = "Path to the bundled API Worker script."
}
