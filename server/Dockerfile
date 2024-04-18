FROM node:16.13.1-alpine3.15
RUN apk update && \
    apk --no-cache --virtual build-dependencies add python2 make g++
ARG NODE_ENV
ARG CONFIG_ENV
ARG LISTEN_PORT
ENV NODE_ENV=${NODE_ENV:-development}
ENV CONFIG_ENV=${CONFIG_ENV:-local}
ENV PORT=${LISTEN_PORT:-8083}
ADD . /opt/app
EXPOSE 8083
WORKDIR /opt/app
RUN pwd
CMD [ "./shell/init" ]
