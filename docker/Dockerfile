# syntax = docker/dockerfile:1

ARG NODE_VERSION="18.19.1"
ARG BASE_VERSION="alpine3.19"

FROM node:${NODE_VERSION}-${BASE_VERSION} as builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm NPM_CONFIG_CACHE=/root/.npm npm install

COPY . ./

ENV PUBLIC_PATH_URL=https://commerce-webapp.stg.cloud.weni.ai/

RUN npm run build-only

FROM nginxinc/nginx-unprivileged:1.25-alpine

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/commerce-webapp/
COPY docker/docker-entrypoint.sh /
RUN mv /usr/share/nginx/html/commerce-webapp/index.html /usr/share/nginx/html/commerce-webapp/index.html.tmpl \
    && cd /usr/share/nginx/html/commerce-webapp/ \
    && ln -s /tmp/index.html

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
