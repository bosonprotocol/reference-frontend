data "terraform_remote_state" "specific_common" {
  backend = "s3"

  config = {
    bucket = var.common_state_bucket_name
    key = var.common_state_key
    region = var.common_state_bucket_region
    encrypt = var.common_state_bucket_is_encrypted
  }
}