FROM node:22.14.0-bookworm

RUN curl -fsSL https://code-server.dev/install.sh | sh
RUN code-server --install-extension fill-labs.dependi
RUN code-server --install-extension Vue.volar
RUN code-server --install-extension njzy.stats-bar
RUN code-server --install-extension donjayamanne.githistory
RUN code-server --install-extension Tencent-Cloud.coding-copilot
RUN code-server --install-extension cnbcool.cnb-welcome
RUN code-server --install-extension yandeu.five-server

RUN apt-get update && apt-get install -y curl wget unzip openssh-server git 

ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8