locals {
  project = "${var.prefix}-${var.env_short}-${var.domain}"

  github = {
    org        = "pagopa"
    repository = "io-services-metadata"
  }

  env_secrets = {
    "AZURE_CLIENT_ID_CD"    = module.identity_cd.identity_client_id
    "AZURE_SUBSCRIPTION_ID" = data.azurerm_subscription.current.subscription_id
    "AZURE_TENANT_ID"       = data.azurerm_subscription.current.tenant_id
  }
}
