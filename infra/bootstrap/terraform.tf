terraform {
  required_version = ">= 0.13"

  required_providers {
    aws      = {
      source  = "hashicorp/aws"
      version = "~> 3.16"
    }
    template = {
      source  = "hashicorp/template"
      version = "~> 2.2.0"
    }
  }
}