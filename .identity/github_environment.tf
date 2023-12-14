resource "github_repository_environment" "prod_cd" {
  environment = "${var.env}-cd"
  repository  = local.github.repository
}

resource "github_actions_environment_secret" "github_environment_runner_secrets" {
  for_each        = local.env_secrets
  repository      = local.github.repository
  environment     = github_repository_environment.prod_cd.environment
  secret_name     = each.key
  plaintext_value = each.value
}
