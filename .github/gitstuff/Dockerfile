FROM alpine/git

LABEL "com.github.actions.name"="Git stuff"
LABEL "com.github.actions.description"="Commit all and push"
LABEL "com.github.actions.icon"="upload-cloud"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="http://github.com/Cimera42/gcode-explainer"
LABEL "homepage"="https://cimera42.github.io/gcode-explainer/"
LABEL "maintainer"="Tim Porritt <tim.m.porritt@github.com>"

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]