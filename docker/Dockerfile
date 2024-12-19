# syntax = docker/dockerfile:1

ARG NODE_VERSION="18.19.1"
ARG BASE_VERSION="alpine3.19"
ARG OLD_IMAGE="commerce-webapp:latest"
ARG KEEP_DAYS=60

FROM node:${NODE_VERSION}-${BASE_VERSION} as builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm NPM_CONFIG_CACHE=/root/.npm npm install

COPY . ./

RUN npm run build-only

FROM ${OLD_IMAGE} AS old_css

FROM nginxinc/nginx-unprivileged:1.25-alpine
ARG OLD_IMAGE=${OLD_IMAGE}
ARG KEEP_DAYS=${KEEP_DAYS}

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx docker/headers /usr/share/nginx/html/headers
COPY --chown=nginx:nginx docker/file_handler.sh /
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/commerce-webapp/
COPY --from=old_css --chown=nginx:nginx /usr/share/nginx/html/commerce-webapp/assets/all.tx[t] /usr/share/nginx/html/commerce-webapp/assets/*.css /usr/share/nginx/html/chats/assets/
COPY docker/docker-entrypoint.sh /
RUN mv /usr/share/nginx/html/commerce-webapp/index.html /usr/share/nginx/html/commerce-webapp/index.html.tmpl \
    && cd /usr/share/nginx/html/commerce-webapp/ \
    && ln -s /tmp/index.html \
    && /file_handler.sh css

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
