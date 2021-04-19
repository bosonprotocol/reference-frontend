data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid = "PublicReadAccess"

    principals {
      identifiers = ["*"]
      type = "AWS"
    }

    effect = "Allow"

    actions = ["s3:GetObject"]

    resources = ["arn:aws:s3:::${var.bucket_name}/*"]

    condition {
      test = "StringEquals"
      values = [var.bucket_secret]
      variable = "aws:UserAgent"
    }
  }
}

resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  policy = data.aws_iam_policy_document.bucket_policy.json

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = {
    DeploymentIdentifier = var.deployment_identifier
  }
}
