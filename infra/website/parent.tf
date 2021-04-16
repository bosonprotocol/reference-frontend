data "terraform_remote_state" "parent_common" {
  backend = "s3"

  config = {
    bucket = var.parent_common_state_bucket_name
    key = var.parent_common_state_key
    region = var.parent_common_state_bucket_region
    encrypt = var.parent_common_state_bucket_is_encrypted
  }
}