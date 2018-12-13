workflow "Build and push" {
  on = "push"
  resolves = ["Github pages", "Github clone"]
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
  needs = ["Node stuff"]
  secrets = ["GITHUB_TOKEN"]
}