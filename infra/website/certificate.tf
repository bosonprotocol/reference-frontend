data "aws_acm_certificate" "website" {
  provider = aws.cdn_region

  domain = "*.${var.certificate_domain_name}"
  statuses = ["ISSUED"]
  most_recent = true
}
