resource "aws_route53_record" "public_primary_address" {
  zone_id = data.terraform_remote_state.specific_common.outputs.public_zone_id
  name = var.primary_address
  type = "A"

  alias {
    name = aws_cloudfront_distribution.website_cdn.domain_name
    zone_id = aws_cloudfront_distribution.website_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "private_primary_address" {
  zone_id = data.terraform_remote_state.specific_common.outputs.private_zone_id
  name = var.primary_address
  type = "A"

  alias {
    name = aws_cloudfront_distribution.website_cdn.domain_name
    zone_id = aws_cloudfront_distribution.website_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "public_website_cdn_alias" {
  provider = aws.parent

  count = length(var.other_addresses)

  zone_id = data.terraform_remote_state.parent_common.outputs.public_zone_id
  name = var.other_addresses[count.index]
  type = "A"

  alias {
    name = aws_cloudfront_distribution.website_cdn.domain_name
    zone_id = aws_cloudfront_distribution.website_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "private_website_cdn_alias" {
  provider = aws.parent

  count = length(var.other_addresses)

  zone_id = data.terraform_remote_state.parent_common.outputs.private_zone_id
  name = var.other_addresses[count.index]
  type = "A"

  alias {
    name = aws_cloudfront_distribution.website_cdn.domain_name
    zone_id = aws_cloudfront_distribution.website_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
