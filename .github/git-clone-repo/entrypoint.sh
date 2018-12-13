#!/bin/sh

git config user.name "Tim Porritt - GitHub Actions"
git config user.email "tim.m.porritt@gmail.com"

git remote rm origin
git remote add origin https://$REPO_PUSH@github.com/Cimera42/gcode-explainer-public.git
git push --set-upstream origin master

git push origin
