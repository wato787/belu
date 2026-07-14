resource "cloudflare_d1_database" "this" {
  account_id = var.account_id
  name       = var.name

  read_replication = {
    mode = "disabled"
  }
}
