resource "cloudflare_r2_bucket" "this" {
  account_id    = var.account_id
  name          = var.name
  storage_class = var.storage_class
}

resource "cloudflare_r2_bucket_cors" "this" {
  account_id  = var.account_id
  bucket_name = cloudflare_r2_bucket.this.name

  rules = [
    {
      id = "direct-photo-upload"
      allowed = {
        methods = ["PUT", "HEAD"]
        origins = var.allowed_origins
        headers = ["content-type"]
      }
      expose_headers  = ["etag"]
      max_age_seconds = 3600
    },
  ]
}
