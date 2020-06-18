data "local_file" "api_key" {
  filename = pathexpand("~/.credentials/burst-writing-translate-api.txt")
}

resource "aws_ssm_parameter" "gtranslate_api_key" {
  name        = "/burst-writing/translate/api-key"
  description = "Google Translate API Key"
  type        = "SecureString"
  value       = data.local_file.api_key.content

  tags = {
    Project = "Burst Writer"
  }
}
