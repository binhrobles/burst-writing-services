terraform {
  backend "remote" {
    organization = "binhrobles"

    workspaces {
      name = "burst-writing"
    }
  }
}

provider "aws" {
  region = var.region
}

module "database" {
  source = "../modules/database"
}
