variable "account_id" {
  type        = string
  description = "Cloudflare account ID."
}

variable "assets_path" {
  type        = string
  description = "Path to the built web assets directory."
}

variable "name" {
  type        = string
  description = "Web Worker name."
}
