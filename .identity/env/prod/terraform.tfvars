prefix    = "io"
env       = "prod"
env_short = "p"
domain    = "services-metadata"

cd_github_federations = [
  {
    repository = "io-services-metadata"
    subject    = "prod-cd"
  }
]

environment_cd_roles = {
  subscription = []
  resource_groups = {
    "terraform-state-rg" = [
      "Storage Blob Data Contributor"
    ],
    "io-p-rg-common" = [
      "Storage Account Contributor"
    ],
    "io-p-assets-cdn-rg" = [
      "CDN Endpoint Contributor"
    ]
  }
}
