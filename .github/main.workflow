workflow "Build and push" {
  on = "push"
  resolves = ["Github pages"]
}

action "Node stuff" {
  uses = "./.github/nodestuff"
}

action "Github pages" {
  uses = "./.github/github-pages"
  needs = ["Node stuff"]
  secrets = ["GITHUB_TOKEN"]
}