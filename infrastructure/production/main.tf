terraform {
  backend "remote" {
    organization = "burst-writing"

    workspaces {
      name = "burst-writing-db"
    }
  }
}

provider "aws" {
  region = var.region
}

module "database" {
  source = "../modules/database"
}
