output "cdn_hostname" {
  value = aws_cloudfront_distribution.website_cdn.domain_name
}

output "cdn_id" {
  value = aws_cloudfront_distribution.website_cdn.id
}

output "cdn_arn" {
  value = aws_cloudfront_distribution.website_cdn.arn
}

output "cdn_zone_id" {
  value = aws_cloudfront_distribution.website_cdn.hosted_zone_id
}

output "bucket_id" {
  value = aws_s3_bucket.bucket.id
}

output "bucket_arn" {
  value = aws_s3_bucket.bucket.arn
}

output "primary_address" {
  value = var.primary_address
}

output "other_addresses" {
  value = var.other_addresses
}
