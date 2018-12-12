workflow "Build and push" {
  on = "push"
  resolves = ["Git stuff"]
}

action "Node stuff" {
  uses = "./.github/nodestuff"
}

action "Git stuff" {
  uses = "./.github/gitstuff"
  needs = ["Node stuff"]
  secrets = ["GITHUB_TOKEN"]
}