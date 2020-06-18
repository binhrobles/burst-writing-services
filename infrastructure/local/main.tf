provider "aws" {
  region = var.region

  access_key = "fake"
  secret_key = "fake"

  skip_requesting_account_id  = true
  skip_credentials_validation = true

  endpoints {
    dynamodb = "http://localhost:4566"
    ssm      = "http://localhost:4566"
  }
}

module "database" {
  source = "../modules/database"
}

module "ssm" {
  source = "../modules/ssm"
}
