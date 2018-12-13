#!/bin/sh

git config user.name "GitHub Actions"
git config user.email "cimera2@gmail.com"

git remote rm origin
git remote add origin https://$REPO_PUSH@github.com/Cimera42/gcode-explainer-public.git

git push origin
