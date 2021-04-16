provider "aws" {
  region = var.region
}

provider "aws" {
  alias = "cdn_region"
  region = "us-east-1"
}

provider "aws" {
  alias = "parent"
  region = var.region

  assume_role {
    role_arn = var.parent_role_arn
  }
}
