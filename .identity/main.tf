terraform {
  required_version = ">=1.6.0"

  required_providers {

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.71.0"
    }

    github = {
      source  = "integrations/github"
      version = "5.42.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

provider "github" {
  owner = "pagopa"
}

data "azurerm_subscription" "current" {}

data "azurerm_client_config" "current" {}
