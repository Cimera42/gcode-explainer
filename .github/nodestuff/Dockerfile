FROM node:10-slim

LABEL "com.github.actions.name"="Node stuff"
LABEL "com.github.actions.description"="Install and build"
LABEL "com.github.actions.icon"="archive"
LABEL "com.github.actions.color"="green"

LABEL "repository"="http://github.com/Cimera42/gcode-explainer"
LABEL "homepage"="https://cimera42.github.io/gcode-explainer/"
LABEL "maintainer"="Tim Porritt <tim.m.porritt@github.com>"

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]