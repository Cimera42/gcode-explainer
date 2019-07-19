workflow "Build and push" {
  on = "push"
  resolves = ["Github pages"]
}

action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Node stuff" {
  needs = "Master"
  uses = "./.github/nodestuff"
}

action "Github pages" {
  uses = "./.github/github-pages"
  needs = "Node stuff"
  secrets = ["GITHUB_TOKEN"]
}