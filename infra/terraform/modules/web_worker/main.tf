resource "cloudflare_workers_script" "this" {
  account_id  = var.account_id
  script_name = var.name

  assets = {
    directory = var.assets_path
    config = {
      not_found_handling = "single-page-application"
    }
  }
}
