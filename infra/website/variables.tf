variable "region" {}

variable "deployment_identifier" {}

variable "bucket_name" {}
variable "bucket_secret" {}

variable "parent_role_arn" {}

variable "parent_domain_name" {}
variable "primary_domain_name" {}
variable "certificate_domain_name" {}

variable "primary_address" {}
variable "other_addresses" {
  type = list(string)
}

variable "common_state_bucket_name" {}
variable "common_state_key" {}
variable "common_state_bucket_region" {}
variable "common_state_bucket_is_encrypted" {}

variable "parent_common_state_bucket_name" {}
variable "parent_common_state_key" {}
variable "parent_common_state_bucket_region" {}
variable "parent_common_state_bucket_is_encrypted" {}
