workflow "Build and push" {
  on = "push"
  resolves = ["Github pages"]
}

action "Node stuff" {
  uses = "./.github/nodestuff"
}

action "Github clone" {
  uses = "./.github/git-clone-repo"
  needs = ["Node stuff"]
  secrets = ["REPO_PUSH"]
}

action "Github pages" {
  uses = "./.github/github-pages"
  needs = ["Github clone"]
  secrets = ["GITHUB_TOKEN"]
}