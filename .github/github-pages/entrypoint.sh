#!/bin/sh

git config user.name "GitHub Actions"
git config user.email "cimera2@gmail.com"

git checkout -b gh-pages
git rm -r ./.github
rm -rf node_modules
find . -maxdepth 1 -not -name "docs" -not -name ".git" -not -name "." -not -name ".gitignore" | xargs git rm -r
mv ./docs/* .
git add --all
git commit -m "Automated build"

git remote rm origin
git remote add origin https://x-access-token:$GITHUB_TOKEN@github.com/Cimera42/gcode-explainer.git

git push origin gh-pages --force
