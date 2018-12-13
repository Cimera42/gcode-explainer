FROM alpine/git

LABEL "com.github.actions.name"="GitHub Repo Clone"
LABEL "com.github.actions.description"="Copies the repo contents into a new repo"
LABEL "com.github.actions.icon"="link"
LABEL "com.github.actions.color"="orange"

LABEL "repository"="http://github.com/Cimera42/gcode-explainer"
LABEL "homepage"="https://cimera42.github.io/gcode-explainer/"
LABEL "maintainer"="Tim Porritt <tim.m.porritt@github.com>"

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
