module "storage_bucket" {
  source  = "infrablocks/encrypted-bucket/aws"
  version = "2.0.0"

  bucket_name = var.storage_bucket_name

  tags = {
    DeploymentType = var.deployment_type
    DeploymentLabel = var.deployment_label
    DeploymentIdentifier = var.deployment_identifier
  }
}
