#!/bin/sh

git config user.name "GitHub Actions"
git config user.email "cimera2@gmail.com"

git checkout -b deploy
git add --all
git rm -r ./.github
git commit -m "Test"

git remote rm origin
git remote add origin https://x-access-token:$GITHUB_TOKEN@github.com/Cimera42/gcode-explainer.git

git push origin deploy
